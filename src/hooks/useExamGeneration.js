import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import { generateExam, deleteExam } from '../api/exams'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'
import { combineDuration, splitDuration } from '../utils/duration'

export var ALL_CHAPTERS_VALUE = 'ALL'

var HISTORY_STORAGE_KEY = 'examgenai:generated-exams'

function loadHistoryFromStorage() {
  try {
    var raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    var parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistoryToStorage(list) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on ignore simplement.
  }
}

export default function useExamGeneration() {
  var toast = useToast()
  var [searchParams] = useSearchParams()
  var initialChapterId = searchParams.get('chapterId') || ''
  var initialCourseId = searchParams.get('courseId') || ''

  var [courses, setCourses] = useState([])
  var [chapters, setChapters] = useState([])
  var [courseId, setCourseId] = useState(initialCourseId)
  var [chapterId, setChapterId] = useState(initialChapterId)
  var [chapter, setChapter] = useState(null)

  var [examTitle, setExamTitle] = useState('')
  var [examDescription, setExamDescription] = useState('')
  var [numberOfQuestions, setNumberOfQuestions] = useState(5)
  var [durationMinutes, setDurationMinutes] = useState(90)
  var [difficultyLevel, setDifficultyLevel] = useState('MEDIUM')
  var [questionTypes, setQuestionTypes] = useState(['QCM', 'TRUE_FALSE', 'OPEN'])

  var [isLoadingMeta, setIsLoadingMeta] = useState(true)
  var [isGenerating, setIsGenerating] = useState(false)
  var [generationStep, setGenerationStep] = useState(0)
  var [error, setError] = useState(null)
  var [exam, setExam] = useState(null)

  var [examsHistory, setExamsHistory] = useState(loadHistoryFromStorage)

  var durationParts = useMemo(function () {
    return splitDuration(durationMinutes)
  }, [durationMinutes])

  useEffect(function () {
    var cancelled = false
    fetchCourses()
      .then(function (data) {
        if (!cancelled) setCourses(data)
      })
      .catch(function (err) {
        if (!cancelled) setError(err.message)
      })
      .finally(function () {
        if (!cancelled) setIsLoadingMeta(false)
      })
    return function () {
      cancelled = true
    }
  }, [])

  useEffect(
    function () {
      if (!courseId) {
        setChapters([])
        return undefined
      }
      var cancelled = false
      fetchChaptersByCourse(courseId)
        .then(function (data) {
          if (cancelled) return
          setChapters(data)
          if (!chapterId && data.length > 0) {
            setChapterId(String(data[0].id))
          }
        })
        .catch(function (err) {
          if (!cancelled) setError(err.message)
        })
      return function () {
        cancelled = true
      }
    },
    [courseId],
  )

  useEffect(
    function () {
      if (!chapterId || chapterId === ALL_CHAPTERS_VALUE) {
        setChapter(null)
        return undefined
      }
      var cancelled = false
      fetchChapterById(chapterId)
        .then(function (data) {
          if (cancelled) return
          setChapter(data)
          setExamTitle(`Examen — ${data.title}`)
          if (data.courseId && !courseId) {
            setCourseId(String(data.courseId))
          }
        })
        .catch(function (err) {
          if (!cancelled) setError(err.message)
        })
      return function () {
        cancelled = true
      }
    },
    [chapterId],
  )

  useEffect(
    function () {
      if (chapterId !== ALL_CHAPTERS_VALUE) return
      var selectedCourse = courses.find(function (c) {
        return String(c.id) === String(courseId)
      })
      if (!selectedCourse) return
      setExamTitle(`Examen — ${selectedCourse.title} (tous les chapitres)`)
    },
    [chapterId, courseId, courses],
  )

  useEffect(
    function () {
      if (!isGenerating) {
        setGenerationStep(0)
        return undefined
      }
      setGenerationStep(0)
      var t1 = setTimeout(function () {
        setGenerationStep(1)
      }, 1800)
      var t2 = setTimeout(function () {
        setGenerationStep(2)
      }, 4200)
      return function () {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    },
    [isGenerating],
  )

  var canSubmit = useMemo(
    function () {
      return (
        Boolean(courseId) &&
        Boolean(chapterId) &&
        examTitle.trim().length > 0 &&
        numberOfQuestions >= 1 &&
        durationMinutes >= 1 &&
        questionTypes.length > 0 &&
        !isGenerating
      )
    },
    [courseId, chapterId, examTitle, numberOfQuestions, durationMinutes, questionTypes, isGenerating],
  )

  function selectCourse(nextCourseId) {
    setCourseId(nextCourseId)
    setChapterId('')
    setChapter(null)
    setExam(null)
  }

  function selectChapter(nextChapterId) {
    setChapterId(nextChapterId)
    setExam(null)
  }

  function setDurationHours(hours) {
    setDurationMinutes(combineDuration(hours, durationParts.minutes))
  }

  function setDurationMinsOnly(minutes) {
    setDurationMinutes(combineDuration(durationParts.hours, minutes))
  }

  function toggleType(typeId) {
    setQuestionTypes(function (prev) {
      return prev.includes(typeId)
        ? prev.filter(function (t) {
            return t !== typeId
          })
        : prev.concat(typeId)
    })
  }

  function addToHistory(createdExam, isAllChapters) {
    var courseTitle =
      courses.find(function (c) {
        return String(c.id) === String(courseId)
      })?.title || ''
    var chapterTitle = isAllChapters ? 'Toutes les chapitres' : chapter ? chapter.title : ''

    var entry = {
      id: createdExam.id,
      title: createdExam.title,
      totalQuestions: createdExam.totalQuestions,
      durationMinutes: createdExam.durationMinutes,
      difficultyLevel: createdExam.difficultyLevel,
      courseId: createdExam.courseId ?? (courseId ? Number(courseId) : null),
      chapterId: createdExam.chapterId ?? null,
      courseTitle: courseTitle,
      chapterTitle: chapterTitle,
      generatedAt: new Date().toISOString(),
    }

    setExamsHistory(function (prev) {
      var withoutDuplicate = prev.filter(function (item) {
        return item.id !== entry.id
      })
      var next = [entry].concat(withoutDuplicate)
      saveHistoryToStorage(next)
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setExam(null)

    if (!canSubmit) {
      var message = MESSAGES.exam.formIncomplete
      setError(message)
      toast.warning(message)
      return null
    }

    var isAllChapters = chapterId === ALL_CHAPTERS_VALUE

    setIsGenerating(true)
    try {
      var created = await generateExam({
        examTitle: examTitle.trim(),
        examDescription: examDescription.trim() || null,
        chapterId: isAllChapters ? null : Number(chapterId),
        courseId: isAllChapters ? Number(courseId) : null,
        numberOfQuestions: Number(numberOfQuestions),
        durationMinutes: Number(durationMinutes),
        difficultyLevel: difficultyLevel,
        questionTypes: questionTypes,
      })
      setGenerationStep(3)
      setExam(created)
      toast.success(MESSAGES.exam.generated(created.title, created.totalQuestions))
      addToHistory(created, isAllChapters)
      return created
    } catch (err) {
      setError(err.message)
      toast.error(err.message || MESSAGES.exam.generateError)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDeleteExam(examId) {
    try {
      await deleteExam(examId)
      setExamsHistory(function (prev) {
        var next = prev.filter(function (item) {
          return item.id !== examId
        })
        saveHistoryToStorage(next)
        return next
      })
      setExam(function (current) {
        return current && current.id === examId ? null : current
      })
      toast.success(MESSAGES.exam.deleted)
      return true
    } catch (err) {
      toast.error(err.message || MESSAGES.exam.deleteError)
      return false
    }
  }

  return {
    courses,
    chapters,
    courseId,
    chapterId,
    chapter,
    examTitle,
    setExamTitle,
    examDescription,
    setExamDescription,
    numberOfQuestions,
    setNumberOfQuestions,
    durationMinutes,
    durationHours: durationParts.hours,
    durationMins: durationParts.minutes,
    setDurationHours,
    setDurationMinsOnly,
    difficultyLevel,
    setDifficultyLevel,
    questionTypes,
    toggleType,
    selectCourse,
    selectChapter,
    isLoadingMeta,
    isGenerating,
    generationStep,
    error,
    setError,
    exam,
    canSubmit,
    handleSubmit,
    handleDeleteExam,
    examsHistory,
  }
}

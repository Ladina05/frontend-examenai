import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import { generateExam } from '../api/exams'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'

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
  var [durationMinutes, setDurationMinutes] = useState(30)
  var [difficultyLevel, setDifficultyLevel] = useState('MEDIUM')
  var [questionTypes, setQuestionTypes] = useState(['QCM', 'TRUE_FALSE', 'OPEN'])

  var [isLoadingMeta, setIsLoadingMeta] = useState(true)
  var [isGenerating, setIsGenerating] = useState(false)
  var [error, setError] = useState(null)
  var [exam, setExam] = useState(null)

  // Historique permanent des examens générés (persisté en localStorage),
  // indépendant du chapitre/cours actuellement sélectionné dans le formulaire.
  var [examsHistory, setExamsHistory] = useState(loadHistoryFromStorage)

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
      if (!chapterId) {
        setChapter(null)
        return undefined
      }
      var cancelled = false
      fetchChapterById(chapterId)
        .then(function (data) {
          if (cancelled) return
          setChapter(data)
          setExamTitle(function (current) {
            return current.trim() ? current : `Examen — ${data.title}`
          })
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

  var canSubmit = useMemo(
    function () {
      return (
        Boolean(chapterId) &&
        examTitle.trim().length > 0 &&
        numberOfQuestions >= 1 &&
        durationMinutes >= 1 &&
        questionTypes.length > 0 &&
        !isGenerating
      )
    },
    [chapterId, examTitle, numberOfQuestions, durationMinutes, questionTypes, isGenerating],
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

  function toggleType(typeId) {
    setQuestionTypes(function (prev) {
      return prev.includes(typeId) ? prev.filter(function (t) {
        return t !== typeId
      }) : prev.concat(typeId)
    })
  }

  function addToHistory(createdExam) {
    var courseTitle = courses.find(function (c) {
      return String(c.id) === String(courseId)
    })?.title || ''
    var chapterTitle = chapter ? chapter.title : ''

    var entry = {
      id: createdExam.id,
      title: createdExam.title,
      totalQuestions: createdExam.totalQuestions,
      durationMinutes: createdExam.durationMinutes,
      difficultyLevel: createdExam.difficultyLevel,
      courseId: createdExam.courseId ?? (courseId ? Number(courseId) : null),
      chapterId: createdExam.chapterId ?? Number(chapterId),
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

    setIsGenerating(true)
    try {
      var created = await generateExam({
        examTitle: examTitle.trim(),
        examDescription: examDescription.trim() || null,
        chapterId: Number(chapterId),
        numberOfQuestions: Number(numberOfQuestions),
        durationMinutes: Number(durationMinutes),
        difficultyLevel: difficultyLevel,
        questionTypes: questionTypes,
      })
      setExam(created)
      toast.success(MESSAGES.exam.generated(created.title, created.totalQuestions))
      addToHistory(created)
      return created
    } catch (err) {
      setError(err.message)
      toast.error(err.message || MESSAGES.exam.generateError)
      return null
    } finally {
      setIsGenerating(false)
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
    setDurationMinutes,
    difficultyLevel,
    setDifficultyLevel,
    questionTypes,
    toggleType,
    selectCourse,
    selectChapter,
    isLoadingMeta,
    isGenerating,
    error,
    setError,
    exam,
    canSubmit,
    handleSubmit,
    examsHistory,
  }
}
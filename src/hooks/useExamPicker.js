import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../api/courses'
import { fetchChaptersByCourse } from '../api/chapters'
import { fetchExamsByChapter, fetchExamsByCourse, fetchExamById } from '../api/exams'

export var ALL_CHAPTERS_VALUE = 'ALL'

export default function useExamPicker() {
  var [searchParams, setSearchParams] = useSearchParams()
  var urlExamId = searchParams.get('examId') || ''

  var [courses, setCourses] = useState([])
  var [chapters, setChapters] = useState([])
  var [exams, setExams] = useState([])
  var [courseExams, setCourseExams] = useState([])
  var [courseId, setCourseId] = useState('')
  var [chapterId, setChapterId] = useState('')
  var [examId, setExamId] = useState(urlExamId)
  var [exam, setExam] = useState(null)

  var [isLoadingMeta, setIsLoadingMeta] = useState(true)
  var [isLoadingChapters, setIsLoadingChapters] = useState(false)
  var [isLoadingExams, setIsLoadingExams] = useState(false)
  var [isLoadingExam, setIsLoadingExam] = useState(false)
  var [error, setError] = useState(null)

  useEffect(function () {
    var cancelled = false

    async function loadCourses() {
      setIsLoadingMeta(true)
      setError(null)
      try {
        var data = await fetchCourses()
        if (!cancelled) setCourses(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoadingMeta(false)
      }
    }

    loadCourses()
    return function () {
      cancelled = true
    }
  }, [])

  useEffect(
    function () {
      if (!courseId) {
        setChapters([])
        setCourseExams([])
        setIsLoadingChapters(false)
        return undefined
      }

      var cancelled = false

      async function loadCourseMeta() {
        setIsLoadingChapters(true)
        setChapters([])
        setCourseExams([])
        try {
          var results = await Promise.all([
            fetchChaptersByCourse(courseId),
            fetchExamsByCourse(courseId),
          ])
          if (cancelled) return
          setChapters(results[0])
          setCourseExams(Array.isArray(results[1]) ? results[1] : [])
        } catch (err) {
          if (!cancelled) setError(err.message)
        } finally {
          if (!cancelled) setIsLoadingChapters(false)
        }
      }

      loadCourseMeta()
      return function () {
        cancelled = true
      }
    },
    [courseId],
  )

  useEffect(
    function () {
      if (!chapterId) {
        setExams([])
        setIsLoadingExams(false)
        return undefined
      }

      var cancelled = false

      async function loadExams() {
        setIsLoadingExams(true)
        setExams([])
        try {
          var data =
            chapterId === ALL_CHAPTERS_VALUE
              ? await fetchExamsByCourse(courseId)
              : await fetchExamsByChapter(chapterId)
          if (cancelled) return
          setExams(data)
        } catch (err) {
          if (!cancelled) setError(err.message)
        } finally {
          if (!cancelled) setIsLoadingExams(false)
        }
      }

      loadExams()
      return function () {
        cancelled = true
      }
    },
    [chapterId, courseId],
  )

  useEffect(
    function () {
      if (!examId) {
        setExam(null)
        return undefined
      }

      var cancelled = false

      async function loadExam() {
        setIsLoadingExam(true)
        setExam(null)
        setError(null)
        try {
          var data = await fetchExamById(examId)
          if (cancelled) return
          setExam(data)
          if (data.courseId) setCourseId(String(data.courseId))
          if (data.chapterId) {
            setChapterId(String(data.chapterId))
          } else if (data.courseId) {
            setChapterId(ALL_CHAPTERS_VALUE)
          }
        } catch (err) {
          if (!cancelled) {
            setExam(null)
            setError(err.message)
          }
        } finally {
          if (!cancelled) setIsLoadingExam(false)
        }
      }

      loadExam()
      return function () {
        cancelled = true
      }
    },
    [examId],
  )

  useEffect(
    function () {
      if (urlExamId && urlExamId !== examId) {
        setExamId(urlExamId)
      }
    },
    [urlExamId],
  )

  var chapterIdsWithExams = {}
  courseExams.forEach(function (item) {
    if (item.chapterId != null) {
      chapterIdsWithExams[String(item.chapterId)] = true
    }
  })
  var hasAnyCourseExam = courseExams.length > 0

  function selectCourse(nextCourseId) {
    setCourseId(nextCourseId)
    setChapterId('')
    setExamId('')
    setExam(null)
    setCourseExams([])
    setSearchParams({})
  }

  function selectChapter(nextChapterId) {
    setChapterId(nextChapterId)
    setExamId('')
    setExam(null)
    setSearchParams({})
  }

  function selectExam(nextExamId) {
    setExamId(nextExamId)
    setSearchParams(nextExamId ? { examId: nextExamId } : {})
  }

  return {
    courses,
    chapters,
    exams,
    courseId,
    chapterId,
    examId,
    exam,
    chapterIdsWithExams,
    hasAnyCourseExam,
    isLoadingMeta,
    isLoadingChapters,
    isLoadingExams,
    isLoadingExam,
    error,
    setError,
    selectCourse,
    selectChapter,
    selectExam,
  }
}

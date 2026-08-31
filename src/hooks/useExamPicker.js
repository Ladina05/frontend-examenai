import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../api/courses'
import { fetchChaptersByCourse } from '../api/chapters'
import { fetchExamsByChapter, fetchExamById } from '../api/exams'

export default function useExamPicker() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlExamId = searchParams.get('examId') || ''

  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])
  const [exams, setExams] = useState([])
  const [courseId, setCourseId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [examId, setExamId] = useState(urlExamId)
  const [exam, setExam] = useState(null)

  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const [isLoadingExam, setIsLoadingExam] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      setIsLoadingMeta(true)
      setError(null)
      try {
        const data = await fetchCourses()
        if (!cancelled) setCourses(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoadingMeta(false)
      }
    }

    loadCourses()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!courseId) {
      setChapters([])
      return
    }

    let cancelled = false

    async function loadChapters() {
      try {
        const data = await fetchChaptersByCourse(courseId)
        if (cancelled) return
        setChapters(data)
        if (!chapterId && data.length > 0) {
          setChapterId(String(data[0].id))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    loadChapters()
    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    if (!chapterId) {
      setExams([])
      return
    }

    let cancelled = false

    async function loadExams() {
      try {
        const data = await fetchExamsByChapter(chapterId)
        if (cancelled) return
        setExams(data)
        if (!examId && data.length > 0) {
          const nextExamId = String(data[0].id)
          setExamId(nextExamId)
          setSearchParams({ examId: nextExamId })
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    loadExams()
    return () => {
      cancelled = true
    }
  }, [chapterId])

  useEffect(() => {
    if (!examId) {
      setExam(null)
      return
    }

    let cancelled = false

    async function loadExam() {
      setIsLoadingExam(true)
      setExam(null)
      setError(null)
      try {
        const data = await fetchExamById(examId)
        if (cancelled) return
        setExam(data)
        if (data.courseId) setCourseId(String(data.courseId))
        if (data.chapterId) setChapterId(String(data.chapterId))
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
    return () => {
      cancelled = true
    }
  }, [examId])

  useEffect(() => {
    if (urlExamId && urlExamId !== examId) {
      setExamId(urlExamId)
    }
  }, [urlExamId])

  function selectCourse(nextCourseId) {
    setCourseId(nextCourseId)
    setChapterId('')
    setExamId('')
    setExam(null)
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
    setSearchParams({ examId: nextExamId })
  }

  return {
    courses,
    chapters,
    exams,
    courseId,
    chapterId,
    examId,
    exam,
    isLoadingMeta,
    isLoadingExam,
    error,
    setError,
    selectCourse,
    selectChapter,
    selectExam,
  }
}

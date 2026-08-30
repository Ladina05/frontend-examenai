import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCourses } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import { generateExam } from '../api/exams'

export default function useExamGeneration() {
  const [searchParams] = useSearchParams()
  const initialChapterId = searchParams.get('chapterId') || ''
  const initialCourseId = searchParams.get('courseId') || ''

  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])
  const [courseId, setCourseId] = useState(initialCourseId)
  const [chapterId, setChapterId] = useState(initialChapterId)
  const [chapter, setChapter] = useState(null)

  const [examTitle, setExamTitle] = useState('')
  const [examDescription, setExamDescription] = useState('')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [difficultyLevel, setDifficultyLevel] = useState('MEDIUM')
  const [questionTypes, setQuestionTypes] = useState(['QCM', 'TRUE_FALSE', 'OPEN'])

  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [exam, setExam] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchCourses()
      .then((data) => {
        if (!cancelled) setCourses(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMeta(false)
      })
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
    fetchChaptersByCourse(courseId)
      .then((data) => {
        if (cancelled) return
        setChapters(data)
        if (!chapterId && data.length > 0) {
          setChapterId(String(data[0].id))
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    if (!chapterId) {
      setChapter(null)
      return
    }
    let cancelled = false
    fetchChapterById(chapterId)
      .then((data) => {
        if (cancelled) return
        setChapter(data)
        setExamTitle((current) => (current.trim() ? current : `Examen — ${data.title}`))
        if (data.courseId && !courseId) {
          setCourseId(String(data.courseId))
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [chapterId])

  const canSubmit = useMemo(() => {
    return (
      Boolean(chapterId) &&
      examTitle.trim().length > 0 &&
      numberOfQuestions >= 1 &&
      durationMinutes >= 1 &&
      questionTypes.length > 0 &&
      !isGenerating
    )
  }, [chapterId, examTitle, numberOfQuestions, durationMinutes, questionTypes, isGenerating])

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
    setQuestionTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId],
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setExam(null)

    if (!canSubmit) {
      setError('Complétez le formulaire avant de lancer la génération.')
      return
    }

    setIsGenerating(true)
    try {
      const created = await generateExam({
        examTitle: examTitle.trim(),
        examDescription: examDescription.trim() || null,
        chapterId: Number(chapterId),
        numberOfQuestions: Number(numberOfQuestions),
        durationMinutes: Number(durationMinutes),
        difficultyLevel,
        questionTypes,
      })
      setExam(created)
    } catch (err) {
      setError(err.message)
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
  }
}

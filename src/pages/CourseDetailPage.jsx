import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ListTree, Sparkles } from 'lucide-react'
import { fetchCourseById } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import FileTypeBadge from '../components/FileTypeBadge'
import ChapterListItem from '../components/ChapterListItem'
import StatusBanner from '../components/StatusBanner'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'

export default function CourseDetailPage() {
  const { id } = useParams()

  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [selectedChapterId, setSelectedChapterId] = useState(null)
  const [chapterDetail, setChapterDetail] = useState(null)
  const [isLoadingChapter, setIsLoadingChapter] = useState(false)
  const [chapterError, setChapterError] = useState(null)

  useEffect(() => {
    let isCancelled = false

    async function load() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [courseData, chaptersData] = await Promise.all([
          fetchCourseById(id),
          fetchChaptersByCourse(id),
        ])
        if (isCancelled) return
        setCourse(courseData)
        setChapters(chaptersData)
        if (chaptersData.length > 0) {
          setSelectedChapterId(chaptersData[0].id)
        }
      } catch (err) {
        if (!isCancelled) setLoadError(err.message)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      isCancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!selectedChapterId) {
      setChapterDetail(null)
      return
    }

    let isCancelled = false

    async function loadChapter() {
      setIsLoadingChapter(true)
      setChapterError(null)
      try {
        const data = await fetchChapterById(selectedChapterId)
        if (!isCancelled) setChapterDetail(data)
      } catch (err) {
        if (!isCancelled) setChapterError(err.message)
      } finally {
        if (!isCancelled) setIsLoadingChapter(false)
      }
    }

    loadChapter()
    return () => {
      isCancelled = true
    }
  }, [selectedChapterId])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-600">
        <Spinner size={18} />
        <span className="text-sm">Chargement du cours…</span>
      </div>
    )
  }

  if (loadError || !course) {
    return (
      <div className="space-y-4">
        <BackLink />
        <StatusBanner type="error" message={loadError || 'Ce cours est introuvable.'} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <header className="index-card border-solid p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileTypeBadge fileType={course.fileType} />
              <span className="font-mono text-xs text-ink-600/60">{chapters.length} chapitre(s)</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">{course.title}</h1>
            {course.description && (
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                {course.description}
              </p>
            )}
          </div>
          {selectedChapterId && (
            <Link
              to={`/generation?courseId=${course.id}&chapterId=${selectedChapterId}`}
              className="btn-primary shrink-0"
            >
              <Sparkles size={16} />
              Générer un examen
            </Link>
          )}
        </div>
      </header>

      {chapters.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun chapitre détecté"
          description="Ce document n'a pas encore été analysé, ou son contenu n'a livré aucun chapitre exploitable."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[300px,1fr]">
          <aside className="index-card h-fit border-solid p-4 lg:sticky lg:top-10">
            <div className="mb-3 flex items-center gap-2 px-1">
              <ListTree size={16} className="text-pen" />
              <h2 className="font-display text-sm font-semibold text-ink-900">Table des matières</h2>
            </div>
            <div className="space-y-0.5">
              {chapters.map((chapter) => (
                <ChapterListItem
                  key={chapter.id}
                  chapter={chapter}
                  isActive={chapter.id === selectedChapterId}
                  onClick={() => setSelectedChapterId(chapter.id)}
                />
              ))}
            </div>
          </aside>

          <section className="index-card border-solid p-0">
            {isLoadingChapter ? (
              <div className="flex items-center gap-2 px-6 py-16 text-ink-600">
                <Spinner size={16} />
                <span className="text-sm">Ouverture du chapitre…</span>
              </div>
            ) : chapterError ? (
              <div className="p-6">
                <StatusBanner type="error" message={chapterError} />
              </div>
            ) : chapterDetail ? (
              <div>
                <div className="flex items-baseline gap-3 border-b border-dashed border-ink-900/10 px-6 py-5">
                  <span className="font-mono text-sm text-pen">
                    {String(chapterDetail.chapterNumber).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-ink-900">
                    {chapterDetail.title}
                  </h2>
                </div>
                <div className="relative border-l-2 border-pen/25 px-6 py-6 ml-6">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-ink-800">
                    {chapterDetail.content}
                  </p>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/courses"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-pen"
    >
      <ArrowLeft size={15} />
      Retour aux cours
    </Link>
  )
}

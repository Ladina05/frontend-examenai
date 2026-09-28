import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, BookOpen, FileWarning, ListTree, Bot } from 'lucide-react'
import { fetchCourseById } from '../api/courses'
import { fetchChaptersByCourse, fetchChapterById } from '../api/chapters'
import FileTypeBadge from '../components/courses/FileTypeBadge'
import ChapterListItem from '../components/courses/ChapterListItem'
import StatusBanner from '../components/ui/StatusBanner'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import LoadingBlock from '../components/ui/LoadingBlock'

export default function CourseDetailPage() {
  var { id } = useParams()

  var [course, setCourse] = useState(null)
  var [chapters, setChapters] = useState([])
  var [isLoading, setIsLoading] = useState(true)
  var [loadError, setLoadError] = useState(null)

  var [selectedChapterId, setSelectedChapterId] = useState(null)
  var [chapterDetail, setChapterDetail] = useState(null)
  var [isLoadingChapter, setIsLoadingChapter] = useState(false)
  var [chapterError, setChapterError] = useState(null)

  useEffect(
    function () {
      var isCancelled = false

      async function load() {
        setIsLoading(true)
        setLoadError(null)
        try {
          var results = await Promise.all([fetchCourseById(id), fetchChaptersByCourse(id)])
          if (isCancelled) return
          setCourse(results[0])
          setChapters(results[1])
          if (results[1].length > 0) {
            setSelectedChapterId(results[1][0].id)
          }
        } catch (err) {
          if (!isCancelled) setLoadError(err.message)
        } finally {
          if (!isCancelled) setIsLoading(false)
        }
      }

      load()
      return function () {
        isCancelled = true
      }
    },
    [id],
  )

  useEffect(
    function () {
      if (!selectedChapterId) {
        setChapterDetail(null)
        return undefined
      }

      var isCancelled = false

      async function loadChapter() {
        setIsLoadingChapter(true)
        setChapterError(null)
        try {
          var data = await fetchChapterById(selectedChapterId)
          if (!isCancelled) setChapterDetail(data)
        } catch (err) {
          if (!isCancelled) setChapterError(err.message)
        } finally {
          if (!isCancelled) setIsLoadingChapter(false)
        }
      }

      loadChapter()
      return function () {
        isCancelled = true
      }
    },
    [selectedChapterId],
  )

  if (isLoading) {
    return <LoadingBlock label="Chargement du cours…" />
  }

  if (loadError || !course) {
    return (
      <div className="space-y-4">
        <Breadcrumb />
        <StatusBanner type="error" message={loadError || 'Ce cours est introuvable.'} />
      </div>
    )
  }

  var selectedChapter = chapters.find(function (c) {
    return c.id === selectedChapterId
  })
  var hasContent = Boolean(chapterDetail?.content && String(chapterDetail.content).trim())

  return (
    <div className="space-y-5">
      <Breadcrumb courseTitle={course.title} chapterTitle={selectedChapter?.title} />

      <header className="surface">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <FileTypeBadge fileType={course.fileType} />
              <span className="badge bg-paper-100 text-ink-700">
                {chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              {course.title}
            </h1>
            {course.description ? (
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                {course.description}
              </p>
            ) : (
              <p className="mt-1.5 text-sm text-ink-600/60">
                Sélectionnez un chapitre à gauche, puis générez un examen.
              </p>
            )}
            {selectedChapter && (
              <p className="mt-3 text-xs text-ink-600">
                Chapitre actif :{' '}
                <span className="font-semibold text-ink-800">
                  {String(selectedChapter.chapterNumber).padStart(2, '0')} — {selectedChapter.title}
                </span>
              </p>
            )}
          </div>
          {selectedChapterId && (
            <Link
              to={`/generation?courseId=${course.id}&chapterId=${selectedChapterId}`}
              className="btn-primary shrink-0"
            >
              <Bot size={16} />
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
        <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
          <aside className="surface h-fit p-3 lg:sticky lg:top-8">
            <div className="mb-2 flex items-center gap-2 px-2 py-1">
              <ListTree size={15} className="text-pen" />
              <h2 className="text-sm font-semibold text-ink-900">Chapitres</h2>
            </div>
            <div className="space-y-0.5">
              {chapters.map(function (chapter) {
                return (
                  <ChapterListItem
                    key={chapter.id}
                    chapter={chapter}
                    isActive={chapter.id === selectedChapterId}
                    onClick={function () {
                      setSelectedChapterId(chapter.id)
                    }}
                  />
                )
              })}
            </div>
          </aside>

          <section className="surface overflow-hidden p-0">
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
                <div className="flex flex-wrap items-center gap-3 border-b border-ink-900/10 px-5 py-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pen-tint font-mono text-xs font-bold text-pen-dark">
                    {String(chapterDetail.chapterNumber).padStart(2, '0')}
                  </span>
                  <h2 className="min-w-0 flex-1 text-base font-semibold text-ink-900 sm:text-lg">
                    {chapterDetail.title}
                  </h2>
                  <Link
                    to={`/generation?courseId=${course.id}&chapterId=${chapterDetail.id}`}
                    className="btn-ghost shrink-0 text-pen"
                  >
                    <Bot size={14} />
                    Générer
                  </Link>
                </div>

                {hasContent ? (
                  <div className="px-5 py-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-ink-800">
                      {chapterDetail.content}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-900">
                      <FileWarning size={22} />
                    </div>
                    <h3 className="text-base font-semibold text-ink-900">
                      Aucun texte détectable
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-ink-600">
                      Ce chapitre n’a pas de contenu exploitable. Choisissez un autre chapitre dans
                      la liste, ou lancez quand même une génération si besoin.
                    </p>
                    <div className="mt-1 flex flex-wrap justify-center gap-2">
                      <Link
                        to={`/generation?courseId=${course.id}&chapterId=${chapterDetail.id}`}
                        className="btn-primary"
                      >
                        <Bot size={16} />
                        Générer quand même
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  )
}

function Breadcrumb({ courseTitle, chapterTitle }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link to="/courses" className="font-medium text-ink-600 transition-colors hover:text-pen">
        Cours
      </Link>
      {courseTitle ? (
        <>
          <ChevronRight size={14} className="shrink-0 text-ink-400" aria-hidden="true" />
          <span className="max-w-[12rem] truncate font-semibold text-ink-900 sm:max-w-xs">
            {courseTitle}
          </span>
        </>
      ) : null}
      {chapterTitle ? (
        <>
          <ChevronRight size={14} className="shrink-0 text-ink-400" aria-hidden="true" />
          <span className="max-w-[10rem] truncate text-ink-600 sm:max-w-[14rem]">{chapterTitle}</span>
        </>
      ) : null}
    </nav>
  )
}

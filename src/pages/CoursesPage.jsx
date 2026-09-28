import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, Trash2, ArrowUpRight, Layers, UploadCloud } from 'lucide-react'
import { fetchCourses, uploadCourse, deleteCourse } from '../api/courses'
import FileDropZone from '../components/courses/FileDropZone'
import FileTypeBadge from '../components/courses/FileTypeBadge'
import StatusBanner from '../components/ui/StatusBanner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import LoadingBlock from '../components/ui/LoadingBlock'
import ListToolbar from '../components/ui/ListToolbar'
import useListControls from '../hooks/useListControls'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'

function courseSearchText(course) {
  return [course.title, course.description, course.fileType].filter(Boolean).join(' ')
}

export default function CoursesPage() {
  var toast = useToast()

  var [courses, setCourses] = useState([])
  var [isLoadingCourses, setIsLoadingCourses] = useState(true)
  var [loadError, setLoadError] = useState(null)

  var [isModalOpen, setIsModalOpen] = useState(false)
  var [file, setFile] = useState(null)
  var [title, setTitle] = useState('')
  var [description, setDescription] = useState('')
  var [isSubmitting, setIsSubmitting] = useState(false)
  var [formError, setFormError] = useState(null)

  var [courseToDelete, setCourseToDelete] = useState(null)
  var [isDeleting, setIsDeleting] = useState(false)

  var list = useListControls(courses, { getSearchText: courseSearchText })

  async function loadCourses() {
    setIsLoadingCourses(true)
    setLoadError(null)
    try {
      var data = await fetchCourses()
      setCourses(data)
    } catch (err) {
      setLoadError(err.message || MESSAGES.course.loadError)
    } finally {
      setIsLoadingCourses(false)
    }
  }

  useEffect(function () {
    loadCourses()
  }, [])

  function openModal() {
    setFile(null)
    setTitle('')
    setDescription('')
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    if (isSubmitting) return
    setIsModalOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)

    if (!file) {
      setFormError(MESSAGES.course.validationFile)
      return
    }
    if (!title.trim()) {
      setFormError(MESSAGES.course.validationTitle)
      return
    }

    setIsSubmitting(true)
    try {
      await uploadCourse({ file: file, title: title.trim(), description: description.trim() })
      toast.success(MESSAGES.course.uploaded(title.trim()))
      setFile(null)
      setTitle('')
      setDescription('')
      setIsModalOpen(false)
      await loadCourses()
    } catch (err) {
      setFormError(err.message)
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!courseToDelete) return
    setIsDeleting(true)
    try {
      await deleteCourse(courseToDelete.id)
      setCourses(function (prev) {
        return prev.filter(function (c) {
          return c.id !== courseToDelete.id
        })
      })
      setCourseToDelete(null)
      toast.success(MESSAGES.course.deleted)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-header-kicker">Bibliothèque</p>
          <h1 className="page-header-title">Vos supports de cours</h1>
          <p className="page-header-desc">
            Déposez un support : les chapitres sont extraits automatiquement, prêts pour la génération.
          </p>
        </div>
        <button type="button" className="btn-primary shrink-0" onClick={openModal}>
          <Plus size={16} />
          Ajouter un cours
        </button>
      </header>

      {loadError && (
        <StatusBanner
          type="error"
          message={loadError}
          onDismiss={function () {
            setLoadError(null)
          }}
        />
      )}

      {isLoadingCourses ? (
        <LoadingBlock label="Récupération de vos cours…" />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun cours pour l'instant"
          description="Déposez votre premier support : ses chapitres apparaîtront ici, prêts à devenir des examens."
          action={
            <button type="button" className="btn-primary" onClick={openModal}>
              <UploadCloud size={16} />
              Ajouter un cours
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <ListToolbar
            search={list.search}
            onSearchChange={list.setSearch}
            searchPlaceholder="Rechercher un cours…"
            pageSize={list.pageSize}
            onPageSizeChange={list.setPageSize}
            page={list.page}
            totalPages={list.totalPages}
            totalItems={list.totalItems}
            onPageChange={list.setPage}
          />
          {list.totalItems === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-ink-600">
              Aucun résultat pour « {list.search} ».
            </p>
          ) : (
            <>
              <div className="mobile-card-list">
                {list.pageItems.map(function (course) {
                  var chapterCount = course.chapters?.length ?? 0
                  var isDeletingThisRow = isDeleting && courseToDelete?.id === course.id
                  return (
                    <div key={course.id} className="mobile-card">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/courses/${course.id}`} className="mobile-card-title hover:text-pen">
                            {course.title}
                          </Link>
                          <p className="mt-1 line-clamp-2 text-xs text-ink-600">
                            {course.description || 'Aucune description'}
                          </p>
                        </div>
                        <FileTypeBadge fileType={course.fileType} />
                      </div>
                      <div className="mobile-card-meta">
                        <span className="badge bg-paper-100 text-ink-700">
                          <Layers size={12} />
                          {chapterCount} chapitre{chapterCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="mobile-card-actions">
                        <Link to={`/courses/${course.id}`} className="btn-secondary flex-1 py-2 text-xs">
                          <ArrowUpRight size={14} />
                          Ouvrir
                        </Link>
                        <button
                          type="button"
                          onClick={function () {
                            setCourseToDelete(course)
                          }}
                          disabled={isDeletingThisRow}
                          className="btn-ghost-danger"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Chapitres</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.pageItems.map(function (course) {
                      var chapterCount = course.chapters?.length ?? 0
                      var isDeletingThisRow = isDeleting && courseToDelete?.id === course.id

                      return (
                        <tr key={course.id}>
                          <td>
                            <FileTypeBadge fileType={course.fileType} />
                          </td>
                          <td>
                            <Link
                              to={`/courses/${course.id}`}
                              className="font-medium text-ink-900 hover:text-pen"
                            >
                              {course.title}
                            </Link>
                          </td>
                          <td className="max-w-xs truncate text-ink-600">
                            {course.description || <span className="text-ink-600/40">—</span>}
                          </td>
                          <td>
                            <span className="badge bg-paper-100 text-ink-700">
                              <Layers size={12} />
                              {chapterCount}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <Link to={`/courses/${course.id}`} className="btn-ghost">
                                <ArrowUpRight size={14} />
                                Ouvrir
                              </Link>
                              <button
                                type="button"
                                onClick={function () {
                                  setCourseToDelete(course)
                                }}
                                disabled={isDeletingThisRow}
                                className="btn-ghost-danger"
                              >
                                <Trash2 size={14} />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <Modal
        open={isModalOpen}
        title="Ajouter un cours"
        onClose={closeModal}
        isBusy={isSubmitting}
        closeOnOverlay={!isSubmitting}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={closeModal} disabled={isSubmitting}>
              Annuler
            </button>
            <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Spinner size={14} />}
              {isSubmitting ? 'Extraction en cours…' : 'Téléverser et extraire les chapitres'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileDropZone file={file} onFileSelected={setFile} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="field-label mb-1.5">
                Titre du cours
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={function (e) {
                  setTitle(e.target.value)
                }}
                placeholder="ex. Design UX/UI — Prototypage"
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="description" className="field-label mb-1.5">
                Description <span className="normal-case tracking-normal text-ink-600/50">(facultatif)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value)
                }}
                placeholder="ex. Semestre 2, ENI Fianarantsoa"
                className="field-input"
              />
            </div>
          </div>
          <StatusBanner
            type="error"
            message={formError}
            onDismiss={function () {
              setFormError(null)
            }}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(courseToDelete)}
        title="Supprimer ce cours ?"
        description={
          courseToDelete
            ? `« ${courseToDelete.title} », ses chapitres et les examens associés seront définitivement supprimés.`
            : ''
        }
        onCancel={function () {
          setCourseToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { BookOpen, UploadCloud } from 'lucide-react'
import { fetchCourses, uploadCourse, deleteCourse } from '../api/courses'
import FileDropZone from '../components/courses/FileDropZone'
import CourseCard from '../components/courses/CourseCard'
import StatusBanner from '../components/ui/StatusBanner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'

export default function CoursesPage() {
  var toast = useToast()

  var [courses, setCourses] = useState([])
  var [isLoadingCourses, setIsLoadingCourses] = useState(true)
  var [loadError, setLoadError] = useState(null)

  var [file, setFile] = useState(null)
  var [title, setTitle] = useState('')
  var [description, setDescription] = useState('')
  var [isSubmitting, setIsSubmitting] = useState(false)
  var [formError, setFormError] = useState(null)

  var [courseToDelete, setCourseToDelete] = useState(null)
  var [isDeleting, setIsDeleting] = useState(false)

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
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-pen">Bibliothèque</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Vos supports de cours</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
          Déposez un support de cours pour que ses chapitres soient extraits automatiquement.
          Vous pourrez ensuite en générer des examens, chapitre par chapitre.
        </p>
      </header>

      <section className="index-card border-solid p-6">
        <div className="mb-5 flex items-center gap-2">
          <UploadCloud size={18} className="text-pen" />
          <h2 className="font-display text-lg font-semibold text-ink-900">Ajouter un cours</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileDropZone file={file} onFileSelected={setFile} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink-800">
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
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-800">
                Description <span className="text-ink-600/50">(facultatif)</span>
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value)
                }}
                placeholder="ex. Semestre 2, ENI Fianarantsoa"
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none"
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

          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting && <Spinner size={14} />}
              {isSubmitting ? 'Extraction en cours…' : 'Téléverser et extraire les chapitres'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {isLoadingCourses ? 'Chargement…' : `${courses.length} cours`}
          </h2>
        </div>

        {loadError && (
          <div className="mb-4">
            <StatusBanner
              type="error"
              message={loadError}
              onDismiss={function () {
                setLoadError(null)
              }}
            />
          </div>
        )}

        {isLoadingCourses ? (
          <div className="flex items-center gap-2 py-12 text-ink-600">
            <Spinner size={18} />
            <span className="text-sm">Récupération de vos cours…</span>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aucun cours pour l'instant"
            description="Déposez votre premier support ci-dessus : ses chapitres apparaîtront ici, prêts à devenir des examens."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(function (course) {
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  onDelete={setCourseToDelete}
                  isDeleting={isDeleting && courseToDelete?.id === course.id}
                />
              )
            })}
          </div>
        )}
      </section>

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

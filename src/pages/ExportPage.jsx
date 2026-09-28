import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileOutput, FileDown, Bot, Pencil } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import { downloadExamPdf, downloadExamDocx, triggerFileDownload } from '../api/export'
import StatusBanner from '../components/ui/StatusBanner'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import LoadingBlock from '../components/ui/LoadingBlock'
import ExamSourceCard from '../components/exam/ExamSourceCard'
import ExamSelectCard from '../components/exam/ExamSelectCard'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'
import { formatDurationLabel } from '../utils/duration'

var DIFFICULTY_LABELS = { EASY: 'Facile', MEDIUM: 'Moyen', HARD: 'Difficile' }

export default function ExportPage() {
  var toast = useToast()
  var picker = useExamPicker()

  var [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  var [isDownloadingDocx, setIsDownloadingDocx] = useState(false)
  var [downloadError, setDownloadError] = useState(null)
  var [downloadSuccess, setDownloadSuccess] = useState(null)

  async function handleDownloadPdf() {
    setDownloadError(null)
    setDownloadSuccess(null)
    setIsDownloadingPdf(true)
    try {
      var result = await downloadExamPdf(picker.examId)
      triggerFileDownload(result.blob, result.filename)
      var message = MESSAGES.export.pdfSuccess(result.filename)
      toast.success(message)
      setDownloadSuccess({ message: message })
    } catch (err) {
      setDownloadError(err.message)
      toast.error(err.message || MESSAGES.export.error)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  async function handleDownloadDocx() {
    setDownloadError(null)
    setDownloadSuccess(null)
    setIsDownloadingDocx(true)
    try {
      var result = await downloadExamDocx(picker.examId)
      triggerFileDownload(result.blob, result.filename)
      var message = MESSAGES.export.docxSuccess(result.filename)
      toast.success(message)
      setDownloadSuccess({ message: message })
    } catch (err) {
      setDownloadError(err.message)
      toast.error(err.message || MESSAGES.export.error)
    } finally {
      setIsDownloadingDocx(false)
    }
  }

  return (
    <div className="space-y-6">
      <Header examId={picker.examId} />

      {picker.error && (
        <StatusBanner
          type="error"
          message={picker.error}
          onDismiss={function () {
            picker.setError(null)
          }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr,1.1fr]">
        <ExamSourceCard
          courses={picker.courses}
          chapters={picker.chapters}
          courseId={picker.courseId}
          chapterId={picker.chapterId}
          onCourseChange={picker.selectCourse}
          onChapterChange={picker.selectChapter}
          chapterIdsWithExams={picker.chapterIdsWithExams}
          hasAnyCourseExam={picker.hasAnyCourseExam}
        />
        <ExamSelectCard
          exams={picker.exams}
          chapterId={picker.chapterId}
          examId={picker.examId}
          exam={picker.exam}
          onExamChange={picker.selectExam}
        />
      </div>

      {!picker.examId ? (
        <EmptyState
          icon={FileOutput}
          title="Aucun examen sélectionné"
          description="Sélectionnez un examen ci-dessus, ou générez-en un d’abord si la liste est vide."
          action={
            <Link to="/generation" className="btn-primary">
              <Bot size={16} />
              Aller à la génération
            </Link>
          }
        />
      ) : picker.isLoadingExam ? (
        <LoadingBlock label="Chargement de l'examen…" />
      ) : picker.exam ? (
        <>
          <section className="surface">
            <p className="font-mono text-xs text-ink-600/60">Examen</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">{picker.exam.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge bg-violet-tint text-violet-dark">
                {picker.exam.totalQuestions} question{picker.exam.totalQuestions > 1 ? 's' : ''}
              </span>
              <span className="badge bg-paper-100 text-ink-700">
                {formatDurationLabel(picker.exam.durationMinutes)}
              </span>
              <span className="badge bg-sage-tint text-sage">
                {DIFFICULTY_LABELS[picker.exam.difficultyLevel] || picker.exam.difficultyLevel}
              </span>
            </div>
          </section>

          {downloadError && (
            <StatusBanner
              type="error"
              message={downloadError}
              onDismiss={function () {
                setDownloadError(null)
              }}
            />
          )}

          {downloadSuccess && (
            <div className="space-y-2">
              <StatusBanner
                type="success"
                message={downloadSuccess.message}
                onDismiss={function () {
                  setDownloadSuccess(null)
                }}
              />
              <p className="text-sm text-ink-600">
                Besoin d’ajuster le contenu ?{' '}
                <Link
                  to={`/questions?examId=${picker.examId}`}
                  className="inline-flex items-center gap-1 font-semibold text-pen hover:underline"
                >
                  <Pencil size={14} />
                  Éditer les questions
                </Link>
              </p>
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="index-card group flex flex-col items-start gap-3 border-solid p-6 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pen-tint text-pen-dark">
                {isDownloadingPdf ? <Spinner size={18} /> : <FileDown size={20} />}
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">Télécharger en PDF</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  Format prêt à imprimer, questions et corrigé inclus.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx}
              className="index-card group flex flex-col items-start gap-3 border-solid p-6 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-tint text-violet-dark">
                {isDownloadingDocx ? <Spinner size={18} /> : <FileDown size={20} />}
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">Télécharger en Word</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  Format modifiable, pratique pour ajuster la mise en page.
                </p>
              </div>
            </button>
          </section>
        </>
      ) : null}
    </div>
  )
}

function Header({ examId }) {
  return (
    <header>
      <Link
        to={examId ? `/questions?examId=${examId}` : '/generation'}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-pen"
      >
        <ArrowLeft size={15} />
        {examId ? "Retour à l'édition" : 'Retour à la génération'}
      </Link>
      <p className="page-header-kicker">Étape 5</p>
      <h1 className="page-header-title">Export</h1>
      <p className="page-header-desc">Choisissez un examen, puis téléchargez-le en PDF ou Word.</p>
    </header>
  )
}

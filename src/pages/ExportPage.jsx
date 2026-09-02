import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileOutput, FileDown } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import { downloadExamPdf, downloadExamDocx, triggerFileDownload } from '../api/export'
import StatusBanner from '../components/ui/StatusBanner'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ExamSourceCard from '../components/exam/ExamSourceCard'
import ExamSelectCard from '../components/exam/ExamSelectCard'
import { useToast } from '../context/ToastContext'
import { MESSAGES } from '../constants/messages'

const DIFFICULTY_LABELS = { EASY: 'Facile', MEDIUM: 'Moyen', HARD: 'Difficile' }

export default function ExportPage() {
  var toast = useToast()
  var picker = useExamPicker()

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  async function handleDownloadPdf() {
    setDownloadError(null)
    setIsDownloadingPdf(true)
    try {
      var { blob, filename } = await downloadExamPdf(picker.examId)
      triggerFileDownload(blob, filename)
      toast.success(MESSAGES.export.pdfSuccess(filename))
    } catch (err) {
      setDownloadError(err.message)
      toast.error(err.message || MESSAGES.export.error)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  async function handleDownloadDocx() {
    setDownloadError(null)
    setIsDownloadingDocx(true)
    try {
      var { blob, filename } = await downloadExamDocx(picker.examId)
      triggerFileDownload(blob, filename)
      toast.success(MESSAGES.export.docxSuccess(filename))
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
          description="Choisissez un cours, un chapitre (ou « Toutes les chapitres ») puis un examen ci-dessus pour l'exporter."
        />
      ) : picker.isLoadingExam ? (
        <div className="flex items-center gap-2 py-16 text-ink-600">
          <Spinner size={18} />
          <span className="text-sm">Chargement de l'examen…</span>
        </div>
      ) : picker.exam ? (
        <>
          <section className="index-card border-solid p-6">
            <p className="font-mono text-xs text-ink-600/60">Examen</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">{picker.exam.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge bg-violet-tint text-violet-dark">
                {picker.exam.totalQuestions} question{picker.exam.totalQuestions > 1 ? 's' : ''}
              </span>
              <span className="badge bg-paper-100 text-ink-700">{picker.exam.durationMinutes} min</span>
              <span className="badge bg-sage-tint text-sage">
                {DIFFICULTY_LABELS[picker.exam.difficultyLevel] || picker.exam.difficultyLevel}
              </span>
            </div>
          </section>

          {downloadError && (
            <StatusBanner type="error" message={downloadError} onDismiss={() => setDownloadError(null)} />
          )}

          <section className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="index-card group flex flex-col items-start gap-3 p-6 text-left border-solid disabled:cursor-not-allowed disabled:opacity-60"
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
              className="index-card group flex flex-col items-start gap-3 p-6 text-left border-solid disabled:cursor-not-allowed disabled:opacity-60"
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
      <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 5</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Export</h1>
    </header>
  )
}
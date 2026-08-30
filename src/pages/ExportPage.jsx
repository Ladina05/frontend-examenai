import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileDown, FileOutput, Sparkles } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import { downloadExamDocx, downloadExamPdf, triggerFileDownload } from '../api/export'
import ExamPickerCard from '../components/exam/ExamPickerCard'
import StatusBanner from '../components/StatusBanner'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'

export default function ExportPage() {
  const picker = useExamPicker()
  const [downloading, setDownloading] = useState(null)
  const [downloadError, setDownloadError] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(null)

  async function handleDownload(format) {
    if (!picker.examId) return

    setDownloading(format)
    setDownloadError(null)
    setDownloadSuccess(null)

    try {
      const download = format === 'pdf' ? downloadExamPdf : downloadExamDocx
      const { blob, filename } = await download(picker.examId)
      triggerFileDownload(blob, filename)
      setDownloadSuccess(`Fichier ${filename} téléchargé.`)
    } catch (err) {
      setDownloadError(err.message)
    } finally {
      setDownloading(null)
    }
  }

  if (picker.isLoadingMeta) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-600">
        <Spinner size={18} />
        <span className="text-sm">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 5</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Export</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          Téléchargez l&apos;examen finalisé au format PDF ou Word, prêt à distribuer.
        </p>
      </header>

      {picker.error && (
        <StatusBanner
          type="error"
          message={picker.error}
          onDismiss={() => picker.setError(null)}
        />
      )}

      {downloadError && (
        <StatusBanner
          type="error"
          message={downloadError}
          onDismiss={() => setDownloadError(null)}
        />
      )}

      {downloadSuccess && (
        <StatusBanner
          type="success"
          message={downloadSuccess}
          onDismiss={() => setDownloadSuccess(null)}
        />
      )}

      {picker.courses.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucun cours disponible"
          description="Générez d'abord un examen à partir d'un support de cours."
          action={
            <Link to="/generation" className="btn-primary">
              <Sparkles size={16} />
              Générer un examen
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <ExamPickerCard
            courses={picker.courses}
            chapters={picker.chapters}
            exams={picker.exams}
            courseId={picker.courseId}
            chapterId={picker.chapterId}
            examId={picker.examId}
            exam={picker.exam}
            onCourseChange={picker.selectCourse}
            onChapterChange={picker.selectChapter}
            onExamChange={picker.selectExam}
          />

          <section className="index-card border-solid p-6">
            {!picker.examId ? (
              <EmptyState
                icon={FileOutput}
                title="Choisissez un examen"
                description="Sélectionnez l'examen à exporter dans le panneau de gauche."
              />
            ) : picker.isLoadingExam ? (
              <div className="flex items-center gap-2 py-16 text-ink-600">
                <Spinner size={18} />
                <span className="text-sm">Chargement de l'examen…</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink-900">{picker.exam.title}</h2>
                  <p className="mt-2 text-sm text-ink-600">
                    {picker.exam.totalQuestions} question(s) · {picker.exam.durationMinutes} min
                  </p>
                  {picker.exam.description && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{picker.exam.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={Boolean(downloading)}
                    onClick={() => handleDownload('pdf')}
                  >
                    {downloading === 'pdf' ? <Spinner size={16} /> : <FileDown size={16} />}
                    Télécharger PDF
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={Boolean(downloading)}
                    onClick={() => handleDownload('docx')}
                  >
                    {downloading === 'docx' ? <Spinner size={16} /> : <FileDown size={16} />}
                    Télécharger Word
                  </button>
                </div>

                <p className="text-xs text-ink-600/70">
                  Les fichiers seront nommés <span className="font-mono">exam-{picker.examId}.pdf</span> ou{' '}
                  <span className="font-mono">.docx</span>.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Pencil, FileOutput } from 'lucide-react'
import useExamGeneration from '../hooks/useExamGeneration'
import StatusBanner from '../components/ui/StatusBanner'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import GenerationSourceCard from '../components/generation/GenerationSourceCard'
import GenerationParamsForm from '../components/generation/GenerationParamsForm'

var DIFFICULTY_LABELS = { EASY: 'Facile', MEDIUM: 'Moyen', HARD: 'Difficile' }

export default function GenerationPage() {
  var generation = useExamGeneration()
  var [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    if (generation.isGenerating) return
    setIsModalOpen(false)
  }

  async function handleFormSubmit(e) {
    var created = await generation.handleSubmit(e)
    if (created) {
      setIsModalOpen(false)
    }
  }

  if (generation.isLoadingMeta) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-600">
        <Spinner size={18} />
        <span className="text-sm">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 3</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Génération IA</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
            Choisissez un chapitre, réglez le format de l&apos;examen, puis laissez Gemini produire
            les questions. L&apos;appel peut prendre 20 à 40 secondes.
          </p>
        </div>
        {generation.courses.length > 0 && (
          <button type="button" className="btn-primary shrink-0" onClick={openModal}>
            <Sparkles size={16} />
            Générer un examen
          </button>
        )}
      </header>

      {generation.error && !isModalOpen && (
        <StatusBanner
          type="error"
          message={generation.error}
          onDismiss={function () {
            generation.setError(null)
          }}
        />
      )}

      {generation.courses.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucun cours disponible"
          description="Déposez d'abord un support de cours pour pouvoir générer un examen."
        />
      ) : generation.examsHistory.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucun examen généré pour l'instant"
          description="Cliquez sur « Générer un examen » pour choisir un cours, un chapitre, puis lancer la génération IA."
          action={
            <button type="button" className="btn-primary" onClick={openModal}>
              <Sparkles size={16} />
              Générer un examen
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Cours</th>
                <th>Chapitre</th>
                <th>Questions</th>
                <th>Durée</th>
                <th>Difficulté</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {generation.examsHistory.map(function (exam) {
                return (
                  <tr key={exam.id}>
                    <td className="font-medium text-ink-900">{exam.title}</td>
                    <td className="max-w-[160px] truncate text-ink-600">
                      {exam.courseTitle || <span className="text-ink-600/40">—</span>}
                    </td>
                    <td className="max-w-[160px] truncate text-ink-600">
                      {exam.chapterTitle || <span className="text-ink-600/40">—</span>}
                    </td>
                    <td>
                      {exam.totalQuestions} question{exam.totalQuestions > 1 ? 's' : ''}
                    </td>
                    <td className="font-mono text-xs text-ink-600/70">{exam.durationMinutes} min</td>
                    <td>
                      <span className="badge bg-sage-tint text-sage">
                        {DIFFICULTY_LABELS[exam.difficultyLevel] || exam.difficultyLevel}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/questions?examId=${exam.id}`}
                          className="icon-btn"
                          aria-label="Éditer les questions"
                        >
                          <Pencil size={15} />
                        </Link>
                        <Link to={`/export?examId=${exam.id}`} className="icon-btn" aria-label="Exporter">
                          <FileOutput size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={isModalOpen}
        title="Générer un examen"
        size="lg"
        onClose={closeModal}
        isBusy={generation.isGenerating}
        closeOnOverlay={!generation.isGenerating}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {generation.error && (
            <StatusBanner
              type="error"
              message={generation.error}
              onDismiss={function () {
                generation.setError(null)
              }}
            />
          )}

          <GenerationSourceCard
            courses={generation.courses}
            chapters={generation.chapters}
            courseId={generation.courseId}
            chapterId={generation.chapterId}
            chapter={generation.chapter}
            onCourseChange={generation.selectCourse}
            onChapterChange={generation.selectChapter}
          />
          <GenerationParamsForm
            examTitle={generation.examTitle}
            onExamTitleChange={generation.setExamTitle}
            examDescription={generation.examDescription}
            onExamDescriptionChange={generation.setExamDescription}
            numberOfQuestions={generation.numberOfQuestions}
            onNumberOfQuestionsChange={generation.setNumberOfQuestions}
            durationMinutes={generation.durationMinutes}
            onDurationMinutesChange={generation.setDurationMinutes}
            difficultyLevel={generation.difficultyLevel}
            onDifficultyChange={generation.setDifficultyLevel}
            questionTypes={generation.questionTypes}
            onToggleType={generation.toggleType}
            canSubmit={generation.canSubmit}
            isGenerating={generation.isGenerating}
          />
        </form>
      </Modal>
    </div>
  )
}
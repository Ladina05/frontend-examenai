import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Pencil, FileOutput, UploadCloud, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import useExamGeneration, { ALL_CHAPTERS_VALUE } from '../hooks/useExamGeneration'
import useListControls from '../hooks/useListControls'
import StatusBanner from '../components/ui/StatusBanner'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ListToolbar from '../components/ui/ListToolbar'
import LoadingBlock from '../components/ui/LoadingBlock'
import GenerationSourceCard from '../components/generation/GenerationSourceCard'
import GenerationParamsForm from '../components/generation/GenerationParamsForm'
import GenerationWizardSteps from '../components/generation/GenerationWizardSteps'
import GenerationProgress from '../components/generation/GenerationProgress'
import { formatDurationLabel } from '../utils/duration'
import { DIFFICULTIES } from '../constants/examOptions'
import { MESSAGES } from '../constants/messages'

var DIFFICULTY_LABELS = { EASY: 'Facile', MEDIUM: 'Moyen', HARD: 'Difficile' }

function examSearchText(exam) {
  return [exam.title, exam.courseTitle, exam.chapterTitle, exam.difficultyLevel]
    .filter(Boolean)
    .join(' ')
}

export default function GenerationPage() {
  var generation = useExamGeneration()
  var [isModalOpen, setIsModalOpen] = useState(false)
  var [wizardStep, setWizardStep] = useState(0)
  var [examToDelete, setExamToDelete] = useState(null)
  var [isDeleting, setIsDeleting] = useState(false)
  var list = useListControls(generation.examsHistory, { getSearchText: examSearchText })

  var canGoSourceNext = Boolean(generation.courseId) && Boolean(generation.chapterId)
  var canGoFormatNext =
    generation.examTitle.trim().length > 0 &&
    Number(generation.numberOfQuestions) >= 1 &&
    Number(generation.durationMinutes) >= 1 &&
    generation.questionTypes.length > 0

  function openModal() {
    setWizardStep(0)
    setIsModalOpen(true)
  }

  function closeModal() {
    if (generation.isGenerating) return
    setIsModalOpen(false)
    setWizardStep(0)
  }

  async function handleFormSubmit(e) {
    var created = await generation.handleSubmit(e)
    if (created) {
      setIsModalOpen(false)
      setWizardStep(0)
    }
  }

  async function confirmDeleteExam() {
    if (!examToDelete) return
    setIsDeleting(true)
    try {
      var ok = await generation.handleDeleteExam(examToDelete.id)
      if (ok) setExamToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  function goNext() {
    if (wizardStep === 0 && canGoSourceNext) setWizardStep(1)
    else if (wizardStep === 1 && canGoFormatNext) setWizardStep(2)
  }

  function goBack() {
    if (wizardStep > 0 && !generation.isGenerating) {
      setWizardStep(wizardStep - 1)
    }
  }

  var selectedCourse = generation.courses.find(function (c) {
    return String(c.id) === String(generation.courseId)
  })
  var sourceLabel =
    generation.chapterId === ALL_CHAPTERS_VALUE
      ? (selectedCourse?.title || 'Cours') + ' — Toutes les chapitres'
      : generation.chapter?.title || 'Chapitre sélectionné'
  var difficultyLabel =
    DIFFICULTIES.find(function (d) {
      return d.id === generation.difficultyLevel
    })?.label || generation.difficultyLevel

  if (generation.isLoadingMeta) {
    return <LoadingBlock label="Chargement…" />
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-header-kicker">Étape 3</p>
          <h1 className="page-header-title">Génération IA</h1>
          <p className="page-header-desc">
            Suivez les 3 étapes : source, format, puis lancement.
          </p>
        </div>
        {generation.courses.length > 0 && (
          <button type="button" className="btn-primary shrink-0" onClick={openModal}>
            <Bot size={16} />
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
          icon={UploadCloud}
          title="Commencez par déposer un cours"
          description="Sans support, l’IA n’a rien à lire. Ajoutez un PDF, Word ou texte, puis revenez ici."
          action={
            <Link to="/courses" className="btn-primary">
              <UploadCloud size={16} />
              Aller aux cours
            </Link>
          }
        />
      ) : generation.examsHistory.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="Prêt à générer votre premier examen"
          description="Un assistant en 3 étapes vous guide : source → format → génération."
          action={
            <button type="button" className="btn-primary" onClick={openModal}>
              <Bot size={16} />
              Démarrer
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <ListToolbar
            search={list.search}
            onSearchChange={list.setSearch}
            searchPlaceholder="Rechercher un examen…"
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
                {list.pageItems.map(function (exam) {
                  return (
                    <div key={exam.id} className="mobile-card">
                      <p className="mobile-card-title">{exam.title}</p>
                      <div className="mobile-card-meta">
                        <span>{exam.courseTitle || '—'}</span>
                        <span>·</span>
                        <span>{exam.chapterTitle || '—'}</span>
                      </div>
                      <div className="mobile-card-meta">
                        <span className="badge bg-paper-100 text-ink-700">
                          {exam.totalQuestions} q.
                        </span>
                        <span className="badge bg-paper-100 text-ink-700">
                          {formatDurationLabel(exam.durationMinutes)}
                        </span>
                        <span className="badge bg-sage-tint text-sage">
                          {DIFFICULTY_LABELS[exam.difficultyLevel] || exam.difficultyLevel}
                        </span>
                      </div>
                      <div className="mobile-card-actions">
                        <Link
                          to={`/questions?examId=${exam.id}`}
                          className="btn-secondary flex-1 py-2 text-xs"
                        >
                          <Pencil size={14} />
                          Éditer
                        </Link>
                        <Link
                          to={`/export?examId=${exam.id}`}
                          className="btn-secondary flex-1 py-2 text-xs"
                        >
                          <FileOutput size={14} />
                          Exporter
                        </Link>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          aria-label="Supprimer l'examen"
                          disabled={isDeleting && examToDelete?.id === exam.id}
                          onClick={function () {
                            setExamToDelete(exam)
                          }}
                        >
                          {isDeleting && examToDelete?.id === exam.id ? (
                            <Spinner size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
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
                    {list.pageItems.map(function (exam) {
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
                          <td className="font-mono text-xs text-ink-600/70">
                            {formatDurationLabel(exam.durationMinutes)}
                          </td>
                          <td>
                            <span className="badge bg-sage-tint text-sage">
                              {DIFFICULTY_LABELS[exam.difficultyLevel] || exam.difficultyLevel}
                            </span>
                          </td>
                          <td className="whitespace-nowrap">
                            <div className="table-actions">
                              <Link to={`/questions?examId=${exam.id}`} className="btn-ghost">
                                <Pencil size={14} />
                                Éditer
                              </Link>
                              <Link to={`/export?examId=${exam.id}`} className="btn-ghost">
                                <FileOutput size={14} />
                                Exporter
                              </Link>
                              <button
                                type="button"
                                className="icon-btn icon-btn-danger"
                                aria-label="Supprimer l'examen"
                                disabled={isDeleting && examToDelete?.id === exam.id}
                                onClick={function () {
                                  setExamToDelete(exam)
                                }}
                              >
                                {isDeleting && examToDelete?.id === exam.id ? (
                                  <Spinner size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
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
        title="Générer un examen"
        description="Assistant guidé — une étape à la fois."
        size="lg"
        onClose={closeModal}
        isBusy={generation.isGenerating}
        closeOnOverlay={!generation.isGenerating}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={wizardStep === 0 ? closeModal : goBack}
              disabled={generation.isGenerating}
            >
              {wizardStep === 0 ? (
                'Annuler'
              ) : (
                <>
                  <ArrowLeft size={15} />
                  Retour
                </>
              )}
            </button>

            <div className="flex gap-2">
              {wizardStep < 2 ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={goNext}
                  disabled={wizardStep === 0 ? !canGoSourceNext : !canGoFormatNext}
                >
                  Continuer
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="submit"
                  form="generation-form"
                  className="btn-primary"
                  disabled={!generation.canSubmit}
                >
                  {generation.isGenerating ? (
                    <>
                      <Spinner size={16} />
                      Génération…
                    </>
                  ) : (
                    <>
                      <Bot size={16} />
                      Lancer la génération
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        }
      >
        <form id="generation-form" onSubmit={handleFormSubmit}>
          <GenerationWizardSteps currentStep={wizardStep} />

          {generation.error && (
            <div className="mb-4">
              <StatusBanner
                type="error"
                message={generation.error}
                onDismiss={function () {
                  generation.setError(null)
                }}
              />
            </div>
          )}

          {wizardStep === 0 && (
            <GenerationSourceCard
              courses={generation.courses}
              chapters={generation.chapters}
              courseId={generation.courseId}
              chapterId={generation.chapterId}
              chapter={generation.chapter}
              onCourseChange={generation.selectCourse}
              onChapterChange={generation.selectChapter}
              isLoadingChapters={generation.isLoadingChapters}
              isLoadingChapter={generation.isLoadingChapter}
            />
          )}

          {wizardStep === 1 && (
            <GenerationParamsForm
              examTitle={generation.examTitle}
              onExamTitleChange={generation.setExamTitle}
              examDescription={generation.examDescription}
              onExamDescriptionChange={generation.setExamDescription}
              numberOfQuestions={generation.numberOfQuestions}
              onNumberOfQuestionsChange={generation.setNumberOfQuestions}
              durationHours={generation.durationHours}
              durationMins={generation.durationMins}
              onDurationHoursChange={generation.setDurationHours}
              onDurationMinsChange={generation.setDurationMinsOnly}
              difficultyLevel={generation.difficultyLevel}
              onDifficultyChange={generation.setDifficultyLevel}
              questionTypes={generation.questionTypes}
              onToggleType={generation.toggleType}
              isGenerating={false}
              generationStep={0}
            />
          )}

          {wizardStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">
                  Vérifiez puis lancez
                </h2>
                <p className="mt-1 text-sm text-ink-600">
                  Contrôlez le récapitulatif. La génération peut prendre 20 à 40 secondes.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <RecapItem label="Source" value={sourceLabel} />
                <RecapItem label="Titre" value={generation.examTitle || '—'} />
                <RecapItem
                  label="Questions"
                  value={`${generation.numberOfQuestions} question(s)`}
                />
                <RecapItem
                  label="Durée"
                  value={formatDurationLabel(generation.durationMinutes)}
                />
                <RecapItem label="Difficulté" value={difficultyLabel} />
                <RecapItem
                  label="Types"
                  value={
                    generation.questionTypes.length
                      ? generation.questionTypes.join(', ')
                      : '—'
                  }
                />
              </div>

              {generation.isGenerating && (
                <GenerationProgress activeStep={generation.generationStep} />
              )}
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(examToDelete)}
        title="Supprimer cet examen ?"
        description={
          examToDelete ? MESSAGES.exam.deleteConfirm(examToDelete.title) : ''
        }
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onCancel={function () {
          if (!isDeleting) setExamToDelete(null)
        }}
        onConfirm={confirmDeleteExam}
      />
    </div>
  )
}

function RecapItem({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-paper-50 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600/60">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  )
}

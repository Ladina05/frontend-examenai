import { Link } from 'react-router-dom'
import { ListChecks, Plus, Sparkles } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import useQuestions from '../hooks/useQuestions'
import ExamPickerCard from '../components/exam/ExamPickerCard'
import QuestionCard from '../components/questions/QuestionCard'
import QuestionFormDialog from '../components/questions/QuestionFormDialog'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import StatusBanner from '../components/ui/StatusBanner'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'

export default function QuestionsPage() {
  var picker = useExamPicker()
  var questionsState = useQuestions(picker.examId)

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
        <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 4</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Édition des questions</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          Relisez, corrigez ou complétez les questions générées avant l&apos;export final.
        </p>
      </header>

      {picker.error && (
        <StatusBanner
          type="error"
          message={picker.error}
          onDismiss={function () {
            picker.setError(null)
          }}
        />
      )}

      {questionsState.error && (
        <StatusBanner
          type="error"
          message={questionsState.error}
          onDismiss={function () {
            questionsState.setError(null)
          }}
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

          <section className="space-y-4">
            {!picker.examId ? (
              <EmptyState
                icon={ListChecks}
                title="Choisissez un examen"
                description="Sélectionnez un cours, un chapitre puis l'examen à éditer."
              />
            ) : picker.isLoadingExam || questionsState.isLoading ? (
              <div className="flex items-center gap-2 py-16 text-ink-600">
                <Spinner size={18} />
                <span className="text-sm">Chargement des questions…</span>
              </div>
            ) : !picker.exam ? (
              <EmptyState
                icon={ListChecks}
                title="Examen introuvable"
                description={
                  picker.error ||
                  "Impossible de charger cet examen. Réessayez ou choisissez un autre examen."
                }
              />
            ) : questionsState.questions.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="Aucune question"
                description="Cet examen ne contient pas encore de questions."
                action={
                  <button type="button" className="btn-primary" onClick={questionsState.openCreateDialog}>
                    <Plus size={16} />
                    Ajouter une question
                  </button>
                }
              />
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink-600">
                    {questionsState.questions.length} question(s) dans « {picker.exam?.title} »
                  </p>
                  <button type="button" className="btn-primary" onClick={questionsState.openCreateDialog}>
                    <Plus size={16} />
                    Ajouter
                  </button>
                </div>

                <div className="space-y-4">
                  {questionsState.questions.map(function (question, index) {
                    return (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        onEdit={questionsState.openEditDialog}
                        onDelete={questionsState.setDeleteTarget}
                      />
                    )
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <QuestionFormDialog
        open={questionsState.dialogOpen}
        examId={Number(picker.examId)}
        initialQuestion={questionsState.editingQuestion}
        isSubmitting={questionsState.isSubmitting}
        error={questionsState.submitError}
        onClose={questionsState.closeDialog}
        onSubmit={questionsState.handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(questionsState.deleteTarget)}
        title="Supprimer cette question ?"
        description="Cette action est définitive. La question sera retirée de l'examen."
        isLoading={questionsState.isDeleting}
        onCancel={function () {
          questionsState.setDeleteTarget(null)
        }}
        onConfirm={questionsState.confirmDelete}
      />
    </div>
  )
}

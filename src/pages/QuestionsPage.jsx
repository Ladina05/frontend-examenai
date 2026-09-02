import { Link } from 'react-router-dom'
import { ListChecks, Plus, ArrowLeft } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import useQuestions from '../hooks/useQuestions'
import StatusBanner from '../components/ui/StatusBanner'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import QuestionCard from '../components/questions/QuestionCard'
import QuestionFormDialog from '../components/questions/QuestionFormDialog'
import ExamSourceCard from '../components/exam/ExamSourceCard'
import ExamSelectCard from '../components/exam/ExamSelectCard'

export default function QuestionsPage() {
  var picker = useExamPicker()
  var questionsState = useQuestions(picker.examId)

  return (
    <div className="space-y-6">
      <Header exam={picker.exam} />

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
          icon={ListChecks}
          title="Aucun examen sélectionné"
          description="Choisissez un cours, un chapitre (ou « Toutes les chapitres ») puis un examen ci-dessus pour éditer ses questions."
        />
      ) : picker.isLoadingExam || questionsState.isLoading ? (
        <div className="flex items-center gap-2 py-16 text-ink-600">
          <Spinner size={18} />
          <span className="text-sm">Chargement des questions…</span>
        </div>
      ) : questionsState.error ? (
        <StatusBanner
          type="error"
          message={questionsState.error}
          onDismiss={function () {
            questionsState.setError(null)
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              {questionsState.questions.length} question{questionsState.questions.length > 1 ? 's' : ''}
            </h2>
            <button type="button" onClick={questionsState.openCreateDialog} className="btn-primary">
              <Plus size={16} />
              Ajouter une question
            </button>
          </div>

          {questionsState.questions.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="Aucune question pour l'instant"
              description="Ajoutez votre première question à cet examen."
              action={
                <button type="button" onClick={questionsState.openCreateDialog} className="btn-primary">
                  <Plus size={16} />
                  Ajouter une question
                </button>
              }
            />
          ) : (
            <div className="space-y-4">
              {questionsState.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onEdit={questionsState.openEditDialog}
                  onDelete={questionsState.setDeleteTarget}
                />
              ))}
            </div>
          )}
        </>
      )}

      <QuestionFormDialog
        open={questionsState.dialogOpen}
        examId={picker.examId}
        initialQuestion={questionsState.editingQuestion}
        isSubmitting={questionsState.isSubmitting}
        error={questionsState.submitError}
        onClose={questionsState.closeDialog}
        onSubmit={questionsState.handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(questionsState.deleteTarget)}
        title="Supprimer cette question ?"
        description="Cette question sera définitivement retirée de l'examen."
        onCancel={function () {
          questionsState.setDeleteTarget(null)
        }}
        onConfirm={questionsState.confirmDelete}
        isLoading={questionsState.isDeleting}
      />
    </div>
  )
}

function Header({ exam }) {
  return (
    <header>
      <Link
        to="/generation"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-pen"
      >
        <ArrowLeft size={15} />
        Retour à la génération
      </Link>
      <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 4</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Édition des questions</h1>
      {exam && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
          Examen : <span className="font-medium text-ink-800">{exam.title}</span>
        </p>
      )}
    </header>
  )
}
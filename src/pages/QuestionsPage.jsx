import { Link } from 'react-router-dom'
import { ListChecks, Plus, ArrowLeft, Bot } from 'lucide-react'
import useExamPicker from '../hooks/useExamPicker'
import useQuestions from '../hooks/useQuestions'
import useListControls from '../hooks/useListControls'
import StatusBanner from '../components/ui/StatusBanner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ListToolbar from '../components/ui/ListToolbar'
import LoadingBlock from '../components/ui/LoadingBlock'
import QuestionCard from '../components/questions/QuestionCard'
import QuestionFormDialog from '../components/questions/QuestionFormDialog'
import ExamSourceCard from '../components/exam/ExamSourceCard'
import ExamSelectCard from '../components/exam/ExamSelectCard'

function questionSearchText(question) {
  return [
    question.statement,
    question.questionType,
    question.difficulty,
    question.correctAnswer,
    Array.isArray(question.options) ? question.options.join(' ') : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export default function QuestionsPage() {
  var picker = useExamPicker()
  var questionsState = useQuestions(picker.examId)
  var list = useListControls(questionsState.questions, { getSearchText: questionSearchText })

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
          chapterIdsWithExams={picker.chapterIdsWithExams}
          hasAnyCourseExam={picker.hasAnyCourseExam}
          isLoadingCourses={picker.isLoadingMeta}
          isLoadingChapters={picker.isLoadingChapters}
        />
        <ExamSelectCard
          exams={picker.exams}
          chapterId={picker.chapterId}
          examId={picker.examId}
          exam={picker.exam}
          onExamChange={picker.selectExam}
          isLoadingExams={picker.isLoadingExams}
        />
      </div>

      {!picker.examId ? (
        <EmptyState
          icon={ListChecks}
          title="Aucun examen sélectionné"
          description="Choisissez un cours, un chapitre, puis un examen pour éditer ses questions."
          action={
            <Link to="/generation" className="btn-primary">
              <Bot size={16} />
              Aller à la génération
            </Link>
          }
        />
      ) : picker.isLoadingExam || questionsState.isLoading ? (
        <LoadingBlock label="Chargement des questions…" />
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              {questionsState.questions.length} question
              {questionsState.questions.length > 1 ? 's' : ''}
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
              description="Ajoutez votre première question à cet examen, ou regénérez depuis l’étape Génération."
              action={
                <button
                  type="button"
                  onClick={questionsState.openCreateDialog}
                  className="btn-primary"
                >
                  <Plus size={16} />
                  Ajouter une question
                </button>
              }
            />
          ) : (
            <div className="table-wrap">
              <ListToolbar
                search={list.search}
                onSearchChange={list.setSearch}
                searchPlaceholder="Rechercher une question…"
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
                <div className="space-y-3 p-3 sm:p-4">
                  {list.pageItems.map(function (question, index) {
                    var absoluteIndex = (list.page - 1) * list.pageSize + index
                    return (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={absoluteIndex}
                        onEdit={questionsState.openEditDialog}
                        onDelete={questionsState.setDeleteTarget}
                      />
                    )
                  })}
                </div>
              )}
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
      <p className="page-header-kicker">Étape 4</p>
      <h1 className="page-header-title">Édition des questions</h1>
      {exam && (
        <p className="page-header-desc">
          Examen : <span className="font-medium text-ink-800">{exam.title}</span>
        </p>
      )}
    </header>
  )
}

import { Sparkles } from 'lucide-react'
import useExamGeneration from '../hooks/useExamGeneration'
import StatusBanner from '../components/StatusBanner'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import GenerationSourceCard from '../components/generation/GenerationSourceCard'
import GenerationParamsForm from '../components/generation/GenerationParamsForm'
import GeneratedExamResult from '../components/generation/GeneratedExamResult'

export default function GenerationPage() {
  const generation = useExamGeneration()

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
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-pen">Étape 3</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Génération IA</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          Choisissez un chapitre, réglez le format de l&apos;examen, puis laissez Gemini produire
          les questions. L&apos;appel peut prendre 20 à 40 secondes.
        </p>
      </header>

      {generation.error && (
        <StatusBanner
          type="error"
          message={generation.error}
          onDismiss={() => generation.setError(null)}
        />
      )}

      {generation.courses.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Aucun cours disponible"
          description="Déposez d'abord un support de cours pour pouvoir générer un examen."
        />
      ) : (
        <form
          onSubmit={generation.handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr,1.1fr]"
        >
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
      )}

      {generation.exam && <GeneratedExamResult exam={generation.exam} />}
    </div>
  )
}

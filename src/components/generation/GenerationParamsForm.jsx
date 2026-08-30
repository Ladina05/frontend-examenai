import { Sparkles } from 'lucide-react'
import { DIFFICULTIES, QUESTION_TYPES } from '../../constants/examOptions'
import Spinner from '../Spinner'

export default function GenerationParamsForm({
  examTitle,
  onExamTitleChange,
  examDescription,
  onExamDescriptionChange,
  numberOfQuestions,
  onNumberOfQuestionsChange,
  durationMinutes,
  onDurationMinutesChange,
  difficultyLevel,
  onDifficultyChange,
  questionTypes,
  onToggleType,
  canSubmit,
  isGenerating,
}) {
  return (
    <section className="index-card space-y-5 border-solid p-6">
      <h2 className="font-display text-lg font-semibold text-ink-900">Paramètres</h2>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">Titre</span>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => onExamTitleChange(e.target.value)}
          className="w-full rounded-xl border border-ink-900/15 px-3 py-2.5 text-sm"
          placeholder="Examen chapitre 1"
          required
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">Description</span>
        <textarea
          value={examDescription}
          onChange={(e) => onExamDescriptionChange(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-ink-900/15 px-3 py-2.5 text-sm"
          placeholder="Optionnel"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">
            Nombre de questions
          </span>
          <input
            type="number"
            min={1}
            max={30}
            value={numberOfQuestions}
            onChange={(e) => onNumberOfQuestionsChange(e.target.value)}
            className="w-full rounded-xl border border-ink-900/15 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-600">
            Durée (min)
          </span>
          <input
            type="number"
            min={1}
            max={240}
            value={durationMinutes}
            onChange={(e) => onDurationMinutesChange(e.target.value)}
            className="w-full rounded-xl border border-ink-900/15 px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-600">
          Difficulté
        </legend>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDifficultyChange(d.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                difficultyLevel === d.id
                  ? 'bg-pen text-white'
                  : 'border border-ink-900/15 bg-white text-ink-700 hover:bg-paper-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-600">
          Types de questions
        </legend>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((t) => {
            const active = questionTypes.includes(t.id)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggleType(t.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-pen-tint text-pen-dark'
                    : 'border border-ink-900/15 bg-white text-ink-700 hover:bg-paper-100'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <button type="submit" disabled={!canSubmit} className="btn-primary w-full sm:w-auto">
        {isGenerating ? (
          <>
            <Spinner size={16} />
            Génération en cours…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Générer l&apos;examen
          </>
        )}
      </button>
    </section>
  )
}

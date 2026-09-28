import { Check, CircleHelp, FileQuestion, ListChecks, PenLine } from 'lucide-react'
import { DIFFICULTIES, QUESTION_TYPES } from '../../constants/examOptions'
import FieldHint from '../ui/FieldHint'
import GenerationProgress from './GenerationProgress'

var TYPE_ICONS = {
  QCM: ListChecks,
  TRUE_FALSE: CircleHelp,
  OPEN: PenLine,
  FILL_IN_BLANK: FileQuestion,
}

export default function GenerationParamsForm({
  examTitle,
  onExamTitleChange,
  examDescription,
  onExamDescriptionChange,
  numberOfQuestions,
  onNumberOfQuestionsChange,
  durationHours,
  durationMins,
  onDurationHoursChange,
  onDurationMinsChange,
  difficultyLevel,
  onDifficultyChange,
  questionTypes,
  onToggleType,
  isGenerating,
  generationStep,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">Format de l&apos;examen</h2>
        <p className="mt-1 text-sm text-ink-600">
          Définissez le titre, la durée et le style des questions.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="field-label">
          Titre de l&apos;examen
          <FieldHint text="Affiché en tête du PDF / Word exporté." />
        </span>
        <input
          type="text"
          value={examTitle}
          onChange={function (e) {
            onExamTitleChange(e.target.value)
          }}
          className="field-input"
          placeholder="Ex. Contrôle continu — Chapitre 1"
          required
        />
      </label>

      <label className="block space-y-1.5">
        <span className="field-label">
          Consignes <span className="font-normal text-ink-400">(optionnel)</span>
          <FieldHint text="Indications pour l’IA et consignes visibles dans l’examen." />
        </span>
        <textarea
          value={examDescription}
          onChange={function (e) {
            onExamDescriptionChange(e.target.value)
          }}
          rows={2}
          className="field-input resize-none"
          placeholder="Contexte ou consignes pour l’examen"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block space-y-1.5">
          <span className="field-label">
            Questions
            <FieldHint text="Entre 1 et 30 questions générées." />
          </span>
          <input
            type="number"
            min={1}
            max={30}
            value={numberOfQuestions}
            onChange={function (e) {
              onNumberOfQuestionsChange(e.target.value)
            }}
            className="field-input"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="field-label">
            Heures
            <FieldHint text="Durée indicative affichée sur l’examen." />
          </span>
          <input
            type="number"
            min={0}
            max={8}
            value={durationHours}
            onChange={function (e) {
              onDurationHoursChange(e.target.value)
            }}
            className="field-input"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="field-label">Minutes</span>
          <input
            type="number"
            min={0}
            max={59}
            value={durationMins}
            onChange={function (e) {
              onDurationMinsChange(e.target.value)
            }}
            className="field-input"
          />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="field-label">
          Difficulté
          <FieldHint text="Influence le niveau de complexité demandé à l’IA." />
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map(function (d) {
            var active = difficultyLevel === d.id
            return (
              <button
                key={d.id}
                type="button"
                title={d.hint}
                onClick={function () {
                  onDifficultyChange(d.id)
                }}
                className={`choice-card flex-row items-center gap-2.5 ${active ? 'choice-card-active' : ''}`}
              >
                <span className={`radio-box ${active ? 'radio-box-on' : ''}`}>
                  {active ? <span className="radio-box-dot" /> : null}
                </span>
                <span className={`text-sm font-semibold ${active ? 'text-pen-dark' : 'text-ink-800'}`}>
                  {d.label}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-ink-600/70">
          {DIFFICULTIES.find(function (d) {
            return d.id === difficultyLevel
          })?.hint || ''}
        </p>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="field-label">
          Types de questions
          <FieldHint text="L’IA répartit les questions parmi les types cochés." />
        </legend>
        <p className="text-xs text-ink-600/70">Cochez au moins un type. Survolez un type pour l’aide.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {QUESTION_TYPES.map(function (t) {
            var active = questionTypes.includes(t.id)
            var Icon = TYPE_ICONS[t.id] || ListChecks
            return (
              <button
                key={t.id}
                type="button"
                title={t.hint}
                onClick={function () {
                  onToggleType(t.id)
                }}
                className={`choice-card flex-row items-center gap-2.5 ${active ? 'choice-card-active' : ''}`}
              >
                <span className={`check-box ${active ? 'check-box-on' : ''}`}>
                  {active ? <Check size={12} strokeWidth={3} /> : null}
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <Icon size={16} className={active ? 'text-pen-dark' : 'text-ink-600'} />
                  <span
                    className={`truncate text-sm font-semibold ${active ? 'text-pen-dark' : 'text-ink-800'}`}
                  >
                    {t.label}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {isGenerating && <GenerationProgress activeStep={generationStep} />}
    </div>
  )
}

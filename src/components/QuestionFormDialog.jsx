import { useEffect, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import Spinner from './Spinner'
import StatusBanner from './StatusBanner'

const QUESTION_TYPES = [
  { value: 'QCM', label: 'QCM' },
  { value: 'TRUE_FALSE', label: 'Vrai / Faux' },
  { value: 'OPEN', label: 'Question ouverte' },
  { value: 'FILL_IN_BLANK', label: 'Texte à trous' },
]

const DIFFICULTIES = [
  { value: 'EASY', label: 'Facile' },
  { value: 'MEDIUM', label: 'Moyen' },
  { value: 'HARD', label: 'Difficile' },
]

function emptyForm() {
  return {
    statement: '',
    questionType: 'QCM',
    difficulty: 'MEDIUM',
    points: 1,
    options: ['', ''],
    correctAnswer: '',
    explanation: '',
  }
}

function formFromQuestion(question) {
  const hasOptions = Array.isArray(question.options) && question.options.length > 0
  return {
    statement: question.statement || '',
    questionType: question.questionType || 'QCM',
    difficulty: question.difficulty || 'MEDIUM',
    points: question.points ?? 1,
    options: hasOptions ? [...question.options] : ['', ''],
    correctAnswer: question.correctAnswer || '',
    explanation: question.explanation || '',
  }
}

export default function QuestionFormDialog({ open, examId, initialQuestion, isSubmitting, error, onClose, onSubmit }) {
  const isEditing = Boolean(initialQuestion)
  const [form, setForm] = useState(emptyForm)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    if (open) {
      setForm(initialQuestion ? formFromQuestion(initialQuestion) : emptyForm())
      setValidationError(null)
    }
  }, [open, initialQuestion])

  if (!open) return null

  const usesOptions = form.questionType === 'QCM' || form.questionType === 'TRUE_FALSE'
  const optionsAreFixed = form.questionType === 'TRUE_FALSE'

  function handleTypeChange(nextType) {
    setForm((prev) => {
      if (nextType === 'TRUE_FALSE') {
        return { ...prev, questionType: nextType, options: ['Vrai', 'Faux'], correctAnswer: '' }
      }
      if (nextType === 'QCM') {
        const alreadyHasOptions = prev.questionType === 'QCM' && prev.options.length >= 2
        return {
          ...prev,
          questionType: nextType,
          options: alreadyHasOptions ? prev.options : ['', ''],
          correctAnswer: alreadyHasOptions ? prev.correctAnswer : '',
        }
      }
      return { ...prev, questionType: nextType, options: [], correctAnswer: '' }
    })
  }

  function updateOption(index, value) {
    setForm((prev) => {
      const wasCorrect = prev.options[index] === prev.correctAnswer
      const nextOptions = prev.options.map((opt, i) => (i === index ? value : opt))
      return {
        ...prev,
        options: nextOptions,
        correctAnswer: wasCorrect ? value : prev.correctAnswer,
      }
    })
  }

  function addOption() {
    setForm((prev) => ({ ...prev, options: [...prev.options, ''] }))
  }

  function removeOption(index) {
    setForm((prev) => {
      const removed = prev.options[index]
      const nextOptions = prev.options.filter((_, i) => i !== index)
      return {
        ...prev,
        options: nextOptions,
        correctAnswer: prev.correctAnswer === removed ? '' : prev.correctAnswer,
      }
    })
  }

  function validate() {
    if (!form.statement.trim()) return 'Le libellé de la question est obligatoire.'
    if (!form.points || Number(form.points) < 1) return 'Le nombre de points doit être au moins 1.'

    if (usesOptions) {
      const filledOptions = form.options.map((o) => o.trim()).filter(Boolean)
      if (filledOptions.length < 2) return 'Il faut au moins 2 options.'
      if (!form.correctAnswer.trim()) return 'Choisissez la bonne réponse parmi les options.'
      if (!filledOptions.includes(form.correctAnswer.trim())) {
        return 'La bonne réponse doit correspondre à une option existante.'
      }
    } else if (!form.correctAnswer.trim()) {
      return 'Indiquez une réponse modèle.'
    }

    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validate()
    if (validation) {
      setValidationError(validation)
      return
    }
    setValidationError(null)

    const payload = {
      statement: form.statement.trim(),
      questionType: form.questionType,
      difficulty: form.difficulty,
      points: Number(form.points),
      options: usesOptions ? form.options.map((o) => o.trim()).filter(Boolean) : [],
      correctAnswer: form.correctAnswer.trim(),
      explanation: form.explanation.trim() || null,
    }
    if (!isEditing) {
      payload.examId = examId
    }

    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="index-card relative flex max-h-full w-full max-w-xl flex-col border-solid">
        <div className="flex items-center justify-between border-b border-dashed border-ink-900/10 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {isEditing ? 'Modifier la question' : 'Ajouter une question'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-ink-600 hover:bg-paper-100 hover:text-pen"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Énoncé</label>
            <textarea
              value={form.statement}
              onChange={(e) => setForm((prev) => ({ ...prev, statement: e.target.value }))}
              rows={3}
              placeholder="ex. Quelle est la différence entre un besoin et un objectif utilisateur ?"
              className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Type</label>
              <select
                value={form.questionType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-pen focus:outline-none"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Difficulté</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-pen focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Points</label>
              <input
                type="number"
                min={1}
                value={form.points}
                onChange={(e) => setForm((prev) => ({ ...prev, points: e.target.value }))}
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-pen focus:outline-none"
              />
            </div>
          </div>

          {usesOptions ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-ink-800">
                  Options <span className="text-ink-600/50">(sélectionnez la bonne réponse)</span>
                </label>
                {!optionsAreFixed && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-1 text-xs font-semibold text-pen hover:text-pen-dark"
                  >
                    <Plus size={13} />
                    Ajouter une option
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {form.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option !== '' && option === form.correctAnswer}
                      onChange={() => setForm((prev) => ({ ...prev, correctAnswer: option }))}
                      className="h-4 w-4 shrink-0 accent-pen"
                    />
                    <input
                      type="text"
                      value={option}
                      readOnly={optionsAreFixed}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className={`w-full rounded-xl border border-ink-900/15 px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none ${
                        optionsAreFixed ? 'bg-paper-100' : 'bg-white'
                      }`}
                    />
                    {!optionsAreFixed && form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        aria-label="Retirer cette option"
                        className="shrink-0 rounded-lg p-1.5 text-ink-600 hover:bg-pen-tint hover:text-pen"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Réponse modèle</label>
              <textarea
                value={form.correctAnswer}
                onChange={(e) => setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                rows={2}
                placeholder="La réponse attendue, utilisée comme référence pour la correction"
                className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">
              Explication <span className="text-ink-600/50">(facultatif)</span>
            </label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
              rows={2}
              placeholder="Pourquoi cette réponse est correcte"
              className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:border-pen focus:outline-none"
            />
          </div>

          <StatusBanner type="error" message={validationError} onDismiss={() => setValidationError(null)} />
          <StatusBanner type="error" message={error} />
        </form>

        <div className="flex justify-end gap-2 border-t border-dashed border-ink-900/10 px-6 py-4">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Spinner size={14} />}
            {isEditing ? 'Enregistrer' : 'Ajouter la question'}
          </button>
        </div>
      </div>
    </div>
  )
}   
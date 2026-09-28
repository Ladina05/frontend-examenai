import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import StatusBanner from '../ui/StatusBanner'

var QUESTION_TYPES = [
  { value: 'QCM', label: 'QCM' },
  { value: 'TRUE_FALSE', label: 'Vrai / Faux' },
  { value: 'OPEN', label: 'Question ouverte' },
  { value: 'FILL_IN_BLANK', label: 'Texte à trous' },
]

var DIFFICULTIES = [
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
  var hasOptions = Array.isArray(question.options) && question.options.length > 0
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

export default function QuestionFormDialog({
  open,
  examId,
  initialQuestion,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}) {
  var isEditing = Boolean(initialQuestion)
  var [form, setForm] = useState(emptyForm)
  var [validationError, setValidationError] = useState(null)

  useEffect(
    function () {
      if (open) {
        setForm(initialQuestion ? formFromQuestion(initialQuestion) : emptyForm())
        setValidationError(null)
      }
    },
    [open, initialQuestion],
  )

  var usesOptions = form.questionType === 'QCM' || form.questionType === 'TRUE_FALSE'
  var optionsAreFixed = form.questionType === 'TRUE_FALSE'

  function handleTypeChange(nextType) {
    setForm(function (prev) {
      if (nextType === 'TRUE_FALSE') {
        return { ...prev, questionType: nextType, options: ['Vrai', 'Faux'], correctAnswer: '' }
      }
      if (nextType === 'QCM') {
        var alreadyHasOptions = prev.questionType === 'QCM' && prev.options.length >= 2
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
    setForm(function (prev) {
      var wasCorrect = prev.options[index] === prev.correctAnswer
      var nextOptions = prev.options.map(function (opt, i) {
        return i === index ? value : opt
      })
      return {
        ...prev,
        options: nextOptions,
        correctAnswer: wasCorrect ? value : prev.correctAnswer,
      }
    })
  }

  function addOption() {
    setForm(function (prev) {
      return { ...prev, options: [...prev.options, ''] }
    })
  }

  function removeOption(index) {
    setForm(function (prev) {
      var removed = prev.options[index]
      var nextOptions = prev.options.filter(function (_, i) {
        return i !== index
      })
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
      var filledOptions = form.options.map(function (o) {
        return o.trim()
      }).filter(Boolean)
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
    var validation = validate()
    if (validation) {
      setValidationError(validation)
      return
    }
    setValidationError(null)

    var payload = {
      statement: form.statement.trim(),
      questionType: form.questionType,
      difficulty: form.difficulty,
      points: Number(form.points),
      options: usesOptions
        ? form.options.map(function (o) {
            return o.trim()
          }).filter(Boolean)
        : [],
      correctAnswer: form.correctAnswer.trim(),
      explanation: form.explanation.trim() || null,
    }
    if (!isEditing) {
      payload.examId = examId
    }

    onSubmit(payload)
  }

  return (
    <Modal
      open={open}
      title={isEditing ? 'Modifier la question' : 'Ajouter une question'}
      size="lg"
      onClose={onClose}
      isBusy={isSubmitting}
      closeOnOverlay={!isSubmitting}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Spinner size={14} />}
            {isEditing ? 'Enregistrer' : 'Ajouter la question'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label mb-1.5">Énoncé</label>
          <textarea
            value={form.statement}
            onChange={function (e) {
              setForm(function (prev) {
                return { ...prev, statement: e.target.value }
              })
            }}
            rows={3}
            placeholder="ex. Quelle est la différence entre un besoin et un objectif utilisateur ?"
            className="field-input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label mb-1.5">Type</label>
            <select
              value={form.questionType}
              onChange={function (e) {
                handleTypeChange(e.target.value)
              }}
              className="field-input"
            >
              {QUESTION_TYPES.map(function (t) {
                return (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label className="field-label mb-1.5">Difficulté</label>
            <select
              value={form.difficulty}
              onChange={function (e) {
                setForm(function (prev) {
                  return { ...prev, difficulty: e.target.value }
                })
              }}
              className="field-input"
            >
              {DIFFICULTIES.map(function (d) {
                return (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label className="field-label mb-1.5">Points</label>
            <input
              type="number"
              min={1}
              value={form.points}
              onChange={function (e) {
                setForm(function (prev) {
                  return { ...prev, points: e.target.value }
                })
              }}
              className="field-input"
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
              {form.options.map(function (option, index) {
                return (
                  <div key={index} className="flex items-center gap-2.5">
                    <button
                      type="button"
                      aria-label={`Marquer « ${option || 'option ' + (index + 1)} » comme bonne réponse`}
                      onClick={function () {
                        setForm(function (prev) {
                          return { ...prev, correctAnswer: option }
                        })
                      }}
                      className={`radio-box ${option !== '' && option === form.correctAnswer ? 'radio-box-on' : ''}`}
                    >
                      {option !== '' && option === form.correctAnswer ? (
                        <span className="radio-box-dot" />
                      ) : null}
                    </button>
                    <input
                      type="text"
                      value={option}
                      readOnly={optionsAreFixed}
                      onChange={function (e) {
                        updateOption(index, e.target.value)
                      }}
                      placeholder={`Option ${index + 1}`}
                      className={`field-input py-2 ${optionsAreFixed ? 'bg-paper-100' : ''}`}
                    />
                    {!optionsAreFixed && form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={function () {
                          removeOption(index)
                        }}
                        aria-label="Retirer cette option"
                        className="shrink-0 rounded-lg p-1.5 text-ink-600 hover:bg-pen-tint hover:text-pen"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            <label className="field-label mb-1.5">Réponse modèle</label>
            <textarea
              value={form.correctAnswer}
              onChange={function (e) {
                setForm(function (prev) {
                  return { ...prev, correctAnswer: e.target.value }
                })
              }}
              rows={2}
              placeholder="La réponse attendue, utilisée comme référence pour la correction"
              className="field-input"
            />
          </div>
        )}

        <div>
          <label className="field-label mb-1.5">
            Explication <span className="text-ink-600/50">(facultatif)</span>
          </label>
          <textarea
            value={form.explanation}
            onChange={function (e) {
              setForm(function (prev) {
                return { ...prev, explanation: e.target.value }
              })
            }}
            rows={2}
            placeholder="Pourquoi cette réponse est correcte"
            className="field-input"
          />
        </div>

        <StatusBanner
          type="error"
          message={validationError}
          onDismiss={function () {
            setValidationError(null)
          }}
        />
        <StatusBanner type="error" message={error} />
      </form>
    </Modal>
  )
}

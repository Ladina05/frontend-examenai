import { Pencil, Trash2, Check } from 'lucide-react'

const TYPE_LABELS = {
  QCM: 'QCM',
  TRUE_FALSE: 'Vrai / Faux',
  OPEN: 'Question ouverte',
  FILL_IN_BLANK: 'Texte à trous',
}

const DIFFICULTY_LABELS = {
  EASY: 'Facile',
  MEDIUM: 'Moyen',
  HARD: 'Difficile',
}

export default function QuestionCard({ question, index, onEdit, onDelete }) {
  const hasOptions = Array.isArray(question.options) && question.options.length > 0

  return (
    <div className="index-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-ink-600/60">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="badge bg-violet-tint text-violet-dark">
            {TYPE_LABELS[question.questionType] || question.questionType}
          </span>
          <span className="badge bg-paper-100 text-ink-700">
            {DIFFICULTY_LABELS[question.difficulty] || question.difficulty}
          </span>
          <span className="badge bg-sage-tint text-sage">{question.points} pt</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(question)}
            aria-label="Modifier la question"
            className="rounded-lg p-1.5 text-ink-600 transition-colors duration-150 hover:bg-paper-100 hover:text-violet-dark"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(question)}
            aria-label="Supprimer la question"
            className="rounded-lg p-1.5 text-ink-600 transition-colors duration-150 hover:bg-pen-tint hover:text-pen"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium leading-relaxed text-ink-900">{question.statement}</p>

      {hasOptions ? (
        <ul className="mt-3 space-y-1.5">
          {question.options.map((option, i) => {
            const isCorrect = option === question.correctAnswer
            return (
              <li
                key={i}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  isCorrect ? 'bg-sage-tint text-sage' : 'text-ink-700'
                }`}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {isCorrect && <Check size={13} strokeWidth={3} />}
                </span>
                {option}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-3 rounded-lg bg-sage-tint px-3 py-2 text-sm text-sage">
          <span className="font-medium">Réponse modèle : </span>
          {question.correctAnswer}
        </div>
      )}

      {question.explanation && (
        <p className="mt-3 border-t border-dashed border-ink-900/10 pt-3 text-xs italic leading-relaxed text-ink-600">
          {question.explanation}
        </p>
      )}
    </div>
  )
}
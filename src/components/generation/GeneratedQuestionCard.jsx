import { CheckCircle2 } from 'lucide-react'

export default function GeneratedQuestionCard({ question, index }) {
  return (
    <article className="index-card border-solid p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-pen">Q{index + 1}</span>
        <span className="badge bg-paper-100 text-ink-700">{question.questionType}</span>
        <span className="badge bg-paper-100 text-ink-700">{question.difficulty}</span>
        <span className="badge bg-sage-tint text-sage">{question.points} pt</span>
      </div>
      <p className="font-display text-base font-semibold text-ink-900">{question.statement}</p>
      {question.options?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {question.options.map((option, i) => {
            const isCorrect = option === question.correctAnswer
            return (
              <li
                key={`${question.id}-${i}`}
                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                  isCorrect ? 'bg-sage-tint text-sage' : 'bg-paper-50 text-ink-700'
                }`}
              >
                {isCorrect && <CheckCircle2 size={15} className="mt-0.5 shrink-0" />}
                <span>{option}</span>
              </li>
            )
          })}
        </ul>
      )}
      {question.questionType === 'OPEN' && question.correctAnswer && (
        <p className="mt-3 text-sm text-ink-600">
          <span className="font-semibold text-ink-800">Réponse modèle : </span>
          {question.correctAnswer}
        </p>
      )}
    </article>
  )
}

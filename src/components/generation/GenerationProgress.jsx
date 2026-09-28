import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

var STEPS = [
  { id: 'read', label: 'Lecture du document' },
  { id: 'questions', label: 'Génération des questions' },
  { id: 'answers', label: 'Génération des réponses' },
]

export default function GenerationProgress({ activeStep = 0 }) {
  var progress = Math.min(100, Math.round(((activeStep + 0.35) / STEPS.length) * 100))

  return (
    <div className="rounded-lg border border-pen/20 bg-pen-tint/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-pen-dark">Génération en cours</p>
        <p className="font-mono text-[11px] text-pen/80">{Math.min(progress, 99)}%</p>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-pen transition-all duration-500"
          style={{ width: `${Math.min(progress, 99)}%` }}
        />
      </div>
      <ol className="space-y-2">
        {STEPS.map(function (step, index) {
          var done = index < activeStep
          var current = index === activeStep
          return (
            <li key={step.id} className="flex items-center gap-2.5 text-sm">
              {done ? (
                <CheckCircle2 size={16} className="shrink-0 text-sage" />
              ) : current ? (
                <Loader2 size={16} className="shrink-0 animate-spin text-pen" />
              ) : (
                <Circle size={16} className="shrink-0 text-ink-600/25" />
              )}
              <span
                className={
                  done
                    ? 'text-ink-600/70 line-through decoration-ink-600/25'
                    : current
                      ? 'font-medium text-ink-900'
                      : 'text-ink-600/45'
                }
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-ink-600/70">
        Cela peut prendre 20 à 40 secondes — ne fermez pas cette fenêtre.
      </p>
    </div>
  )
}

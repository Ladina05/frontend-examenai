var STEPS = [
  { id: 'source', label: 'Source' },
  { id: 'format', label: 'Format' },
  { id: 'launch', label: 'Lancer' },
]

export default function GenerationWizardSteps({ currentStep }) {
  return (
    <div className="wizard-steps mb-6">
      {STEPS.map(function (step, index) {
        var done = index < currentStep
        var active = index === currentStep
        return (
          <div key={step.id} className="contents">
            <div
              className={`wizard-step ${active ? 'wizard-step-active' : ''} ${done ? 'wizard-step-done' : ''}`}
            >
              <span className="wizard-dot">{done ? '✓' : index + 1}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {index < STEPS.length - 1 ? <div className="wizard-line" /> : null}
          </div>
        )
      })}
    </div>
  )
}

import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

var STYLES = {
  success: 'border-sage/30 bg-sage-tint text-sage',
  error: 'border-pen/30 bg-pen-tint text-pen-dark',
  info: 'border-violet/30 bg-violet-tint text-violet-dark',
  warning: 'border-amber-300/50 bg-amber-50 text-amber-900',
}

var ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
}

export default function StatusBanner({ type = 'success', message, onDismiss }) {
  if (!message) return null

  var Icon = ICONS[type] || CheckCircle2

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${STYLES[type] || STYLES.success}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fermer le message"
          className="shrink-0 rounded-md p-0.5 hover:bg-black/5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

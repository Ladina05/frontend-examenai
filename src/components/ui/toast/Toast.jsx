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

export default function Toast({ toast, onDismiss }) {
  var Icon = ICONS[toast.type] || Info

  return (
    <div
      role="status"
      className={`toast-item animate-toast-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-pop ${STYLES[toast.type] || STYLES.info}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={function () {
          onDismiss(toast.id)
        }}
        aria-label="Fermer la notification"
        className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  )
}

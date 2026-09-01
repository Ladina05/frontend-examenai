import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

var TITLES = {
  success: 'Succès',
  error: 'Erreur',
  info: 'Information',
  warning: 'Attention',
}

var ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
}

export default function Toast({ toast, onDismiss }) {
  var Icon = ICONS[toast.type] || Info
  var title = TITLES[toast.type] || TITLES.info

  return (
    <div role="status" className={`toast-card toast-${toast.type || 'info'} animate-toast-in`}>
      <div className="toast-card-header">
        <Icon size={16} className="toast-card-icon" />
        <p className="toast-card-title">{title}</p>
        <button
          type="button"
          onClick={function () {
            onDismiss(toast.id)
          }}
          aria-label="Fermer la notification"
          className="toast-card-close"
        >
          <X size={14} />
        </button>
      </div>
      <p className="toast-card-message">{toast.message}</p>
      <div className="toast-progress-track">
        <div className="toast-progress-bar" style={{ animationDuration: `${toast.duration || 4500}ms` }} />
      </div>
    </div>
  )
}
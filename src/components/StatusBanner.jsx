import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

export default function StatusBanner({ type = 'success', message, onDismiss }) {
  if (!message) return null

  const isError = type === 'error'
  const Icon = isError ? AlertTriangle : CheckCircle2

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? 'border-pen/30 bg-pen-tint text-pen-dark'
          : 'border-sage/30 bg-sage-tint text-sage'
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 leading-snug">{message}</p>
      {onDismiss && (
        <button
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

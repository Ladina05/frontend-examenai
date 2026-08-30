import { AlertTriangle } from 'lucide-react'
import Spinner from './Spinner'

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm, isLoading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
      <div className="index-card relative w-full max-w-sm border-solid p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pen-tint text-pen-dark">
          <AlertTriangle size={20} />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
            Annuler
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Spinner size={14} />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

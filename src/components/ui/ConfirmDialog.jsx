import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Spinner from './Spinner'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Supprimer',
  onCancel,
  onConfirm,
  isLoading,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      isBusy={isLoading}
      closeOnOverlay={!isLoading}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
            Annuler
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Spinner size={14} />}
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pen-tint text-pen-dark">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm leading-relaxed text-ink-600">{description}</p>
      </div>
    </Modal>
  )
}

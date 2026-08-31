import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  isBusy = false,
}) {
  useEffect(
    function () {
      if (!open) return undefined

      function onKeyDown(event) {
        if (event.key === 'Escape' && !isBusy) {
          onClose()
        }
      }

      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
      return function () {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeyDown)
      }
    },
    [open, onClose, isBusy],
  )

  if (!open) return null

  var sizeClass =
    size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-xl'

  function handleOverlayClick() {
    if (closeOnOverlay && !isBusy) {
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-ink-900/35"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`index-card relative z-[101] flex max-h-[min(90vh,calc(100vh-2rem))] w-full ${sizeClass} flex-col border-solid shadow-pop`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-dashed border-ink-900/10 px-6 py-4">
          <h2 id="modal-title" className="font-display text-lg font-semibold text-ink-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-ink-600 hover:bg-paper-100 hover:text-pen disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-dashed border-ink-900/10 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

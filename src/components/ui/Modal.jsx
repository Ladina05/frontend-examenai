import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import useFocusTrap from '../../hooks/useFocusTrap'

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  isBusy = false,
}) {
  var titleId = useId()
  var descId = useId()
  var panelRef = useRef(null)
  var closeBtnRef = useRef(null)

  useFocusTrap(open, panelRef, {
    onEscape: onClose,
    isBusy: isBusy,
    initialFocusRef: closeBtnRef,
  })

  useEffect(
    function () {
      if (!open) return undefined
      document.body.style.overflow = 'hidden'
      return function () {
        document.body.style.overflow = ''
      }
    },
    [open],
  )

  if (!open) return null

  var sizeClass =
    size === 'sm'
      ? 'max-w-sm'
      : size === 'lg'
        ? 'max-w-3xl'
        : size === 'xl'
          ? 'max-w-5xl'
          : 'max-w-xl'

  function handleOverlayClick() {
    if (closeOnOverlay && !isBusy) {
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6">
      <div
        className="absolute inset-0 animate-backdrop-in bg-ink-900/35"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`relative z-[101] flex max-h-[min(94vh,calc(100vh-1rem))] w-full ${sizeClass} animate-modal-in flex-col overflow-hidden rounded-t-2xl border border-ink-900/10 bg-white shadow-pop sm:rounded-2xl`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ink-900/10 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-lg font-semibold tracking-tight text-ink-900"
            >
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm leading-relaxed text-ink-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Fermer"
            className="shrink-0 rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-paper-100 hover:text-pen disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-ink-900/10 bg-paper-50 px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

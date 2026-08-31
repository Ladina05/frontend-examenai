import { useToastState } from '../../../context/ToastContext'
import Toast from './Toast'

export default function ToastContainer() {
  var state = useToastState()

  if (state.toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2"
    >
      {state.toasts.map(function (item) {
        return (
          <div key={item.id} className="pointer-events-auto">
            <Toast toast={item} onDismiss={state.dismiss} />
          </div>
        )
      })}
    </div>
  )
}

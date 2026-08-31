import { createContext, useCallback, useContext, useMemo, useState } from 'react'

var ToastContext = createContext(null)

var TOAST_DURATION_MS = 4500

export function ToastProvider({ children }) {
  var [toasts, setToasts] = useState([])

  var dismiss = useCallback(function (id) {
    setToasts(function (prev) {
      return prev.filter(function (t) {
        return t.id !== id
      })
    })
  }, [])

  var addToast = useCallback(
    function (type, message) {
      if (!message) return
      var id = Date.now() + Math.random()
      setToasts(function (prev) {
        return prev.concat({ id: id, type: type, message: message })
      })
      window.setTimeout(function () {
        dismiss(id)
      }, TOAST_DURATION_MS)
    },
    [dismiss],
  )

  var toast = useMemo(
    function () {
      return {
        success: function (message) {
          addToast('success', message)
        },
        error: function (message) {
          addToast('error', message)
        },
        info: function (message) {
          addToast('info', message)
        },
        warning: function (message) {
          addToast('warning', message)
        },
      }
    },
    [addToast],
  )

  var value = useMemo(
    function () {
      return { toast: toast, toasts: toasts, dismiss: dismiss }
    },
    [toast, toasts, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  var context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast doit etre utilise dans ToastProvider')
  }
  return context.toast
}

export function useToastState() {
  var context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastState doit etre utilise dans ToastProvider')
  }
  return { toasts: context.toasts, dismiss: context.dismiss }
}

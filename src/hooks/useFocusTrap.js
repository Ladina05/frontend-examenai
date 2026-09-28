import { useEffect, useRef } from 'react'

var FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function getFocusableElements(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(function (el) {
    return el.getAttribute('aria-hidden') !== 'true'
  })
}

/**
 * Trappe le focus dans un conteneur (modale, menu mobile).
 * options: { onEscape, isBusy, initialFocusRef }
 */
export default function useFocusTrap(active, containerRef, options) {
  var optionsRef = useRef(options)
  optionsRef.current = options
  var restoreRef = useRef(null)

  useEffect(
    function () {
      if (!active) return undefined

      var container = containerRef.current
      if (!container) return undefined

      restoreRef.current = document.activeElement

      var opts = optionsRef.current || {}
      var initial = opts.initialFocusRef && opts.initialFocusRef.current
      var focusables = getFocusableElements(container)
      var target = initial || focusables[0] || container

      if (target === container && !container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1')
      }

      requestAnimationFrame(function () {
        target.focus()
      })

      function onKeyDown(event) {
        var currentOpts = optionsRef.current || {}

        if (event.key === 'Escape' && currentOpts.onEscape && !currentOpts.isBusy) {
          event.preventDefault()
          currentOpts.onEscape()
          return
        }

        if (event.key !== 'Tab') return

        var items = getFocusableElements(container)
        if (items.length === 0) {
          event.preventDefault()
          return
        }

        var first = items[0]
        var last = items[items.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            event.preventDefault()
            last.focus()
          }
        } else if (document.activeElement === last || !container.contains(document.activeElement)) {
          event.preventDefault()
          first.focus()
        }
      }

      document.addEventListener('keydown', onKeyDown)
      return function () {
        document.removeEventListener('keydown', onKeyDown)
        var prev = restoreRef.current
        if (prev && typeof prev.focus === 'function') {
          try {
            prev.focus()
          } catch (e) {
            /* ignore */
          }
        }
      }
    },
    [active, containerRef],
  )
}

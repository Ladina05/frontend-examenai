import { NavLink, Link } from 'react-router-dom'
import { GraduationCap, Menu, X, Bot } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useFocusTrap from '../hooks/useFocusTrap'

var nav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/courses', label: 'Cours' },
  { to: '/generation', label: 'Génération' },
  { to: '/questions', label: 'Questions' },
  { to: '/export', label: 'Export' },
]

export default function TopNav() {
  var [mobileOpen, setMobileOpen] = useState(false)
  var panelRef = useRef(null)
  var closeBtnRef = useRef(null)

  function closeMobile() {
    setMobileOpen(false)
  }

  useFocusTrap(mobileOpen, panelRef, {
    onEscape: closeMobile,
    initialFocusRef: closeBtnRef,
  })

  useEffect(
    function () {
      if (!mobileOpen) return undefined
      document.body.style.overflow = 'hidden'
      return function () {
        document.body.style.overflow = ''
      }
    },
    [mobileOpen],
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-900/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pen text-white">
            <GraduationCap size={18} strokeWidth={2.2} />
          </span>
          <span className="truncate font-display text-lg font-semibold text-ink-900">ExamGenAI</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {nav.map(function (item) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={function ({ isActive }) {
                  return `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-pen text-white'
                      : 'text-ink-700 hover:bg-paper-100 hover:text-ink-900'
                  }`
                }}
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/generation" className="btn-primary hidden sm:inline-flex">
            <Bot size={15} />
            Générer
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-ink-700 hover:bg-paper-100 lg:hidden"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={function () {
              setMobileOpen(true)
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/30"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="absolute inset-x-0 top-0 animate-modal-in rounded-b-2xl border-b border-ink-900/10 bg-white p-4 shadow-pop sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-base font-semibold text-ink-900">Menu</span>
              <button
                ref={closeBtnRef}
                type="button"
                className="rounded-lg p-2 text-ink-600 hover:bg-paper-100"
                aria-label="Fermer le menu"
                onClick={closeMobile}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
              {nav.map(function (item) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobile}
                    className={function ({ isActive }) {
                      return `rounded-xl px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-pen-tint text-pen-dark' : 'text-ink-700 hover:bg-paper-100'
                      }`
                    }}
                  >
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
            <Link to="/generation" onClick={closeMobile} className="btn-primary mt-3 w-full sm:hidden">
              <Bot size={15} />
              Générer un examen
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

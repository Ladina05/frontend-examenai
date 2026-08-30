import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Sparkles,
  ListChecks,
  FileOutput,
  GraduationCap,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { useState } from 'react'
import { useSidebar } from '../context/SidebarContext'

const nav = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/courses', label: 'Mes cours', icon: BookOpen },
  { to: '/generation', label: 'Génération IA', icon: Sparkles },
  { to: '/questions', label: 'Édition des questions', icon: ListChecks },
  { to: '/export', label: 'Export', icon: FileOutput },
]

function NavItem({ to, label, icon: Icon, end, collapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
          collapsed ? 'justify-center px-0' : ''
        } ${
          isActive
            ? 'bg-pen-tint text-pen-dark'
            : 'text-ink-700 hover:bg-paper-100 hover:text-ink-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-pen transition-opacity duration-150 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <Icon size={18} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 origin-left scale-95 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-pop transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ collapsed, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-sidebar-wash">
      <div className={`flex items-center gap-3 px-5 pb-6 pt-8 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pen shadow-card">
          <GraduationCap size={20} strokeWidth={2.2} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-none text-ink-900">
              ExamGenAI
            </p>
            <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-widest text-ink-600/50">
              Salle des profs
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-4 mb-6 rounded-xl border border-dashed border-ink-900/12 bg-white/60 p-4">
          <p className="font-display text-sm italic leading-snug text-ink-700">
            « Un cours bien découpé fait un examen bien pensé. »
          </p>
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Sidebar fixe desktop, largeur animée */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-300 ease-in-out md:block ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div
          className={`fixed h-screen border-r border-ink-900/8 shadow-rail transition-[width] duration-300 ease-in-out ${
            collapsed ? 'w-20' : 'w-72'
          }`}
        >
          <SidebarContent collapsed={collapsed} />
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
            className="absolute -right-3.5 top-9 flex h-7 w-7 items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-600 shadow-card transition-colors duration-150 hover:text-pen"
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>
      </aside>

      {/* Barre mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-900/8 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pen">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-display text-base font-semibold text-ink-900">ExamGenAI</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-ink-700 hover:bg-paper-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-fade-in-up shadow-pop">
            <div className="relative h-full">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                className="absolute right-3 top-3 z-10 rounded-lg p-2 text-ink-600 hover:bg-paper-100 hover:text-pen"
              >
                <X size={20} />
              </button>
              <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

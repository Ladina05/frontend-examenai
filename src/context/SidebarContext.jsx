import { createContext, useContext, useEffect, useState } from 'react'

const SidebarContext = createContext(null)
const STORAGE_KEY = 'examgenai:sidebar-collapsed'

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on ignore simplement.
    }
  }, [collapsed])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar doit être utilisé sous SidebarProvider')
  return ctx
}

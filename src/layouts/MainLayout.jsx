import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-paper-50 md:flex">
      <Sidebar />
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div key={location.pathname} className="mx-auto max-w-5xl animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

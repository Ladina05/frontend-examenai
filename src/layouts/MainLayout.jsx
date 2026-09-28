import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'
import AppFooter from '../components/AppFooter'

export default function MainLayout() {
  var location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-paper-50">
      <TopNav />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div key={location.pathname} className="mx-auto w-full max-w-6xl animate-fade-in-up">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

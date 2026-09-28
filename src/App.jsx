import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ui/toast/ToastContainer'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import GenerationPage from './pages/GenerationPage'
import QuestionsPage from './pages/QuestionsPage'
import ExportPage from './pages/ExportPage'

export default function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/generation" element={<GenerationPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

import HomePage from './pages/HomePage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import CreateCoursePage from './pages/CreateCoursePage.jsx'
import SelectSemesterPage from './pages/SelectSemesterPage.jsx'
import RequireAdminSession from './components/RequireAdminSession.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses/:courseCode/semesters" element={<SelectSemesterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAdminSession />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/upload" element={<UploadPage />} />
        <Route path="/admin/courses/create" element={<CreateCoursePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
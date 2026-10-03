import { Link } from 'react-router-dom'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import '../styles/admin-dashboard.css'

function AdminDashboardPage() {
  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-content">
        <BrandHeader showAdminLogin={false} />
        <section className="admin-actions-panel" aria-label="Admin actions">
          <Link className="admin-action-button" to="/admin/upload">
            Upload
          </Link>
          <Link className="admin-action-button" to="/admin/courses/create">
            Create Course
          </Link>
        </section>
      </div>
      <BottomNavigation />
    </main>
  )
}

export default AdminDashboardPage
import { Link } from 'react-router-dom'
import BrandHeader from '../components/BrandHeader.jsx'
import BottomNavigation from '../components/BottomNavigation.jsx'
import '../styles/admin-dashboard.css'

function AdminActionPage({ title, description }) {
  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-content">
        <BrandHeader showAdminLogin={false} />
        <section className="admin-action-page">
          <h1>{title}</h1>
          <p>{description}</p>
          <Link className="admin-action-back" to="/admin/dashboard">
            Back to dashboard
          </Link>
        </section>
      </div>
      <BottomNavigation />
    </main>
  )
}

export default AdminActionPage
import { House, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import './BottomNavigation.css'

function BottomNavigation() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const profilePath = isAuthenticated ? '/admin/dashboard' : '/admin/login'

  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      <div className="bottom-navigation-inner">
        <Link
          aria-current={location.pathname === '/' ? 'page' : undefined}
          aria-label="Home"
          className={`bottom-nav-link${location.pathname === '/' ? ' is-active' : ''}`}
          to="/"
        >
          <House aria-hidden="true" fill="currentColor" strokeWidth={1.8} />
          <span className="bottom-nav-label">Home</span>
        </Link>
        <Link
          aria-current={isAdminPage ? 'page' : undefined}
          aria-label={isAuthenticated ? 'Admin dashboard' : 'Admin login'}
          className={`bottom-nav-link${isAdminPage ? ' is-active' : ''}`}
          to={profilePath}
        >
          <UserRound aria-hidden="true" fill="currentColor" strokeWidth={1.8} />
        </Link>
      </div>
    </nav>
  )
}

export default BottomNavigation
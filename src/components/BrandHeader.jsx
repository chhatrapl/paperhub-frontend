import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import appLogo from '../assets/images/App_logo.png'
import './BrandHeader.css'

function BrandHeader({ showAdminLogin = true }) {
  return (
    <header className={`brand-header${showAdminLogin ? ' has-admin-login' : ''}`}>
      <Link className="brand-lockup" to="/" aria-label="PaperHub home">
        <img className="brand-logo" src={appLogo} alt="PaperHub" />
      </Link>
      {showAdminLogin && (
        <Link
          className="admin-login-link"
          to="/admin/login"
          aria-label="Admin login"
          title="Admin login"
        >
          <UserRound aria-hidden="true" strokeWidth={1.8} />
        </Link>
      )}
    </header>
  )
}

export default BrandHeader
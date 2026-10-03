import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signInAdmin } from '../api/authApi.js'
import BrandHeader from '../components/BrandHeader.jsx'
import '../styles/admin-login.css'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatusMessage('')
    setStatusType('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await signInAdmin(
        formData.get('email').trim(),
        formData.get('password'),
      )
      navigate('/admin/dashboard', { replace: true })
    } catch (error) {
      setStatusType('error')
      setStatusMessage(error.message || 'Login failed. Check your email and password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-content">
        <BrandHeader showAdminLogin={false} />
        <h1 className="login-title">Admin Login</h1>

        <form className="login-form-panel" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="admin-email">Admin email</label>
          <input
            autoComplete="email"
            className="login-input"
            id="admin-email"
            name="email"
            placeholder="Admin email"
            required
            type="email"
          />

          <label className="sr-only" htmlFor="admin-password">Password</label>
          <div className="password-field">
            <input
              autoComplete="current-password"
              className="login-input"
              id="admin-password"
              name="password"
              placeholder="Password"
              required
              type={passwordVisible ? 'text' : 'password'}
            />
            <button
              aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              className="password-toggle"
              onClick={() => setPasswordVisible((visible) => !visible)}
              type="button"
            >
              {passwordVisible
                ? <EyeOff aria-hidden="true" />
                : <Eye aria-hidden="true" />}
            </button>
          </div>

          <button className="login-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
          {statusMessage && (
            <p className={`login-status is-${statusType}`} role={statusType === 'error' ? 'alert' : 'status'}>
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage
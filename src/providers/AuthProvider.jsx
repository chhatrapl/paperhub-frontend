import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient.js'
import AuthContext from '../contexts/AuthContext.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let isMounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return

      setSession(error ? null : data.session)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    isAuthenticated: Boolean(session),
    isLoading,
    session,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

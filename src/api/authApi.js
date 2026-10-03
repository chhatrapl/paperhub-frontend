import { supabase } from './supabaseClient.js'

export async function signInAdmin(email, password) {
  if (!supabase) {
    throw new Error('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to webapp/.env.local first.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}
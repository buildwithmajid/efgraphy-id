import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const DEMO_AUTH_KEY = 'efg_demo_admin_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const saved = sessionStorage.getItem(DEMO_AUTH_KEY)
      if (saved) setUser({ email: 'owner@efgraphy.id (Mode Demo)', isDemo: true })
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured) {
          throw new Error('Supabase belum dikonfigurasi. Gunakan tombol Mode Demo Lokal atau isi file .env.')
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message?.toLowerCase().includes('invalid login')) {
            throw new Error('Email atau password salah. Silakan periksa kembali.')
          }
          throw new Error('Gagal masuk. Periksa koneksi internet lalu coba lagi.')
        }
        return data.user
      },
      signInDemo() {
        sessionStorage.setItem(DEMO_AUTH_KEY, '1')
        setUser({ email: 'owner@efgraphy.id (Mode Demo)', isDemo: true })
      },
      async signOut() {
        if (!isSupabaseConfigured) {
          sessionStorage.removeItem(DEMO_AUTH_KEY)
          setUser(null)
          return
        }
        await supabase.auth.signOut()
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider')
  return ctx
}

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginPage() {
  const { user, signIn, signInDemo, isSupabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Email atau password tidak sesuai.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemo = () => {
    signInDemo()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col justify-between bg-cream px-5 py-8 text-ink">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke website utama
        </Link>
      </div>

      <div className="mx-auto my-8 w-full max-w-md rounded-sm border border-sand bg-paper p-7 shadow-[0_24px_60px_-32px_rgba(24,23,22,0.18)] sm:p-9">
        <div className="flex items-center gap-3">
          <img src="/logo-mark-dark.png" alt="" className="h-9 w-auto" />
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">Masuk Pengelola</h1>
            <p className="text-xs text-ink-3">Kelola galeri foto, video, paket, dan info studio</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-6 rounded-lg border border-champagne/50 bg-champagne/12 p-4 text-xs leading-relaxed text-ink">
            <p className="font-semibold">Supabase belum terhubung (.env masih kosong)</p>
            <p className="mt-1 text-ink-2">
              Kamu tetap bisa mencoba semua fitur Admin CMS sekarang lewat Mode Demo Lokal (tersimpan di browser ini).
            </p>
            <button
              type="button"
              onClick={handleDemo}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-obsidian px-4 text-xs font-medium text-cream transition-colors hover:bg-ink-2"
            >
              Masuk Mode Demo Lokal
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-ink">
              Email Admin
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@efgraphy.id"
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/50 px-3.5 text-sm text-ink placeholder:text-ink-3 focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-ink">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block min-h-11 w-full rounded-lg border border-sand bg-cream/50 pl-3.5 pr-11 text-sm text-ink placeholder:text-ink-3 focus:border-ink focus:bg-paper focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-3 transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-cream transition-colors hover:bg-wa disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Lock className="size-4" />
            {submitting ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-ink-3">© {new Date().getFullYear()} Efgraphy.id · Memory of Lens</p>
    </div>
  )
}

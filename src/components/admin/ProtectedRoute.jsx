import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream text-ink">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo-mark-dark.png" alt="" className="w-12 animate-pulse opacity-60" />
          <p className="text-sm text-ink-2">Memeriksa sesi admin…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

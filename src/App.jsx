import { lazy, Suspense, useCallback, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import HomePage from './pages/HomePage'

const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const IntroExperience = lazy(() => import('./components/intro/IntroExperience'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminPortfolioPage = lazy(() => import('./pages/admin/AdminPortfolioPage'))
const AdminVideosPage = lazy(() => import('./pages/admin/AdminVideosPage'))
const AdminPackagesPage = lazy(() => import('./pages/admin/AdminPackagesPage'))
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))

const INTRO_KEY = 'efg_intro_seen'

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function shouldShowIntro(pathname) {
  if (pathname !== '/') return false
  if (sessionStorage.getItem(INTRO_KEY) === '1') return false
  return supportsWebGL()
}

function AdminLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream text-sm text-ink-2">
      Memuat panel admin…
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro(pathname))
  const [revealed, setRevealed] = useState(() => !showIntro)

  const handleReveal = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setRevealed(true)
  }, [])
  const handleFinish = useCallback(() => setShowIntro(false), [])

  const replayIntro = useCallback(() => {
    if (!supportsWebGL()) return
    if (pathname !== '/') navigate('/')
    window.scrollTo(0, 0)
    setRevealed(false)
    setShowIntro(true)
  }, [pathname, navigate])

  return (
    <AuthProvider>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route
            path="/"
            element={<HomePage revealed={revealed} onReplayIntro={replayIntro} />}
          />
          <Route path="/portfolio" element={<PortfolioPage onReplayIntro={replayIntro} />} />

          {/* Rute Admin CMS */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="portfolio" element={<AdminPortfolioPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route
            path="*"
            element={<HomePage revealed={revealed} onReplayIntro={replayIntro} />}
          />
        </Routes>
      </Suspense>

      {showIntro && (
        <Suspense fallback={<div className="fixed inset-0 z-[70] bg-obsidian" />}>
          <IntroExperience onReveal={handleReveal} onFinish={handleFinish} />
        </Suspense>
      )}
    </AuthProvider>
  )
}

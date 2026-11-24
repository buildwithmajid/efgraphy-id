import { lazy, Suspense, useCallback, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'

const IntroExperience = lazy(() => import('./components/intro/IntroExperience'))

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

export default function App() {
  const { pathname } = useLocation()
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro(pathname))
  const [revealed, setRevealed] = useState(() => !showIntro)

  const handleReveal = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setRevealed(true)
  }, [])
  const handleFinish = useCallback(() => setShowIntro(false), [])

  const replayIntro = useCallback(() => {
    if (!supportsWebGL()) return
    window.scrollTo(0, 0)
    setRevealed(false)
    setShowIntro(true)
  }, [])

  return (
    <>
      <Routes>
        <Route path="*" element={<HomePage key={revealed ? 'shown' : 'pending'} revealed={revealed} onReplayIntro={replayIntro} />} />
      </Routes>

      {showIntro && (
        <Suspense fallback={<div className="fixed inset-0 z-[70] bg-obsidian" />}>
          <IntroExperience onReveal={handleReveal} onFinish={handleFinish} />
        </Suspense>
      )}
    </>
  )
}

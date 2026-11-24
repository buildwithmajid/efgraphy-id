import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import CameraScene from './CameraScene'
import ViewfinderHUD from './ViewfinderHUD'
import { playFocusBeep, playShutterSound } from '../../lib/shutterSound'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const EASE = [0.16, 1, 0.3, 1]

/**
 * Koreografi 3D Camera Intro (murni GPU-composited opacity & transform agar 60fps tanpa patah-patah):
 *   1. idle      → Kamera di posisi menyerong 3D; kursor di atas kamera bisa putar 360°.
 *   2. align     → Begitu diklik, kamera berputar mulus lewat jarak terdekat hingga lurus ke depan (0, 0, 0),
 *                  lalu berhenti sejenak membidik dengan lampu AF berkedip & bunyi bip fokus.
 *   3. strobe    → "CEKREK!" Kilatan starburst flash memancar nyata dari jendela flash kamera.
 *   4. whiteHold → Cahaya flash putih mengembang halus hingga layar putih penuh. Di balik layar putih ini,
 *                  WebGL dilepas dengan tenang sebelum transisi pudar dimulai (zero frame drop!).
 *   5. reveal    → Layar putih flash memudar sangat mulus membuka halaman utama yang sudah siap di belakang.
 */
export default function IntroExperience({ onReveal, onFinish }) {
  const [phase, setPhaseState] = useState('idle') // idle → align → strobe → whiteHold → reveal
  const [ready, setReady] = useState(false)
  const [sceneGone, setSceneGone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const phaseRef = useRef({ phase: 'idle', t0: 0 })

  const setPhase = (p) => {
    phaseRef.current = { phase: p, t0: performance.now() }
    setPhaseState(p)
  }

  const capture = useCallback(async () => {
    if (phaseRef.current.phase !== 'idle' || !ready) return

    // Tahap 1 (1480ms): Kamera bergerak memutar hingga lurus sejajar (950ms) + diam membidik (530ms)
    setPhase('align')
    await wait(860)
    playFocusBeep()
    await wait(620)

    // Tahap 2 (340ms): "CEKREK!" Kilatan flash starburst memancar langsung dari jendela flash kamera 3D
    playShutterSound()
    setPhase('strobe')
    await wait(340)

    // Tahap 3 (340ms): Layar putih flash menutup mulus ke opacity 100%
    setPhase('whiteHold')
    await wait(240)

    // Lepas WebGL & siapkan halaman utama SAAT layar 100% putih diam (tidak tabrakan dengan animasi fade!)
    setSceneGone(true)
    onReveal?.()
    await wait(160)

    // Tahap 4 (920ms): Layar putih flash memudar super halus membuka halaman utama
    setPhase('reveal')
    await wait(940)
    onFinish?.()
  }, [ready, onReveal, onFinish])

  const skip = useCallback(async () => {
    if (phaseRef.current.phase !== 'idle') return
    setPhase('reveal')
    onReveal?.()
    setLeaving(true)
    await wait(450)
    onFinish?.()
  }, [onReveal, onFinish])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('button')) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        capture()
      } else if (e.key === 'Escape') {
        skip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [capture, skip])

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  const handleReady = useCallback(() => setReady(true), [])
  const isStrobe = phase === 'strobe'
  const isWhiteHold = phase === 'whiteHold'
  const isRevealing = phase === 'reveal'
  const showFlashVeil = isStrobe || isWhiteHold || (isRevealing && !leaving)

  return (
    <MotionConfig reducedMotion="never">
      <motion.div
        role="dialog"
        aria-label="Intro Efgraphy.id"
        className="fixed inset-0 z-[70] select-none overflow-hidden"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ pointerEvents: sceneGone ? 'none' : 'auto' }}
      >
        {!sceneGone && (
          <motion.div
            className="absolute inset-0 bg-obsidian will-change-transform"
            animate={{ scale: isWhiteHold ? 1.035 : isStrobe ? 1.012 : 1 }}
            transition={{ duration: isWhiteHold ? 0.32 : 0.45, ease: EASE }}
          >
            {/* cahaya studio hangat di belakang kamera */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 55% 48% at 50% 38%, rgba(194,166,126,0.17), rgba(194,166,126,0.04) 55%, transparent 75%), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
              }}
            />
            <CameraScene phaseRef={phaseRef} onCameraClick={capture} onReady={handleReady} />

            <ViewfinderHUD
              phase={isStrobe || isWhiteHold ? 'flash' : phase}
              ready={ready}
              onCapture={capture}
              onSkip={skip}
            />

            <AnimatePresence>
              {!ready && (
                <motion.div
                  key="loader"
                  className="absolute inset-0 z-20 grid place-items-center bg-obsidian"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <img src="/logo-mark-light.png" alt="" className="w-16 animate-pulse opacity-60" />
                    <p className="text-[13px] text-cream/55">Menyiapkan lensa…</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Flash kamera murni GPU-composited (hanya opacity & scale, 60fps mulus tanpa patah-patah) */}
      <AnimatePresence>
        {showFlashVeil && (
          <motion.div
            key="camera-flash-veil"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[90] will-change-[opacity]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isWhiteHold ? 1 : isStrobe ? 0.28 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isWhiteHold ? 0.22 : isStrobe ? 0.3 : 0.9,
              ease: isRevealing ? EASE : [0.22, 1, 0.36, 1],
            }}
            style={{
              background: isRevealing
                ? 'radial-gradient(circle at 50% 38%, #ffffff 0%, #fffdf9 45%, #faf8f5 100%)'
                : '#ffffff',
            }}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

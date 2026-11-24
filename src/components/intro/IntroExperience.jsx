import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import CameraScene from './CameraScene'
import ViewfinderHUD from './ViewfinderHUD'
import { playFocusBeep, playShutterSound } from '../../lib/shutterSound'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const EASE = [0.16, 1, 0.3, 1]

/**
 * Koreografi 3D Camera Intro (selalu berjalan penuh saat diklik user — tidak dilewati oleh setting OS):
 *   1. idle      → Kamera di posisi awal menyerong 3D; gerakkan kursor di atas kamera untuk putar 360°.
 *   2. align     → Begitu diklik, TIDAK langsung masuk — kamera berputar mulus lewat jarak terdekat
 *                  dari posisi menyerong/360° hingga LURUS SEJAJAR KE DEPAN (0, 0, 0), lalu berhenti
 *                  sejenak membidik kita sambil lampu AF berkedip & berbunyi bip fokus.
 *   3. strobe    → "CEKREK!" Sinar starburst flash memancar nyata keluar dari jendela flash kamera.
 *   4. whiteHold → Seluruh layar berubah menjadi PUTIH TERANG + efek glitch shutter & blur sebentar.
 *   5. reveal    → Cahaya flash & blur mereda halus membuka website utama.
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

    // Tahap 1 (1550ms): Kamera bergerak memutar lewat jarak terdekat hingga LURUS SEJAJAR (950ms),
    // lalu diam membidik kita di posisi lurus (600ms) dengan bunyi bip autofokus.
    setPhase('align')
    await wait(880)
    playFocusBeep()
    await wait(670)

    // Tahap 2 (420ms): "CEKREK!" — Kilatan flash starburst memancar nyata langsung dari kamera 3D
    playShutterSound()
    setPhase('strobe')
    await wait(420)

    // Tahap 3 (520ms): Layar menjadi PUTIH PENUH + efek glitch shutter & blur sebentar
    setPhase('whiteHold')
    await wait(520)

    // Tahap 4 (950ms): Di balik layar putih flash, buka website utama lalu pudarkan putih + blur
    setPhase('reveal')
    setSceneGone(true)
    onReveal?.()
    await wait(950)
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
            className="absolute inset-0 bg-obsidian"
            animate={
              isWhiteHold
                ? { scale: 1.05, filter: 'blur(26px) brightness(3.2)' }
                : isStrobe
                  ? { scale: 1.015, filter: 'blur(1px) brightness(1.35)' }
                  : { scale: 1, filter: 'blur(0px) brightness(1)' }
            }
            transition={{
              duration: isWhiteHold ? 0.34 : isStrobe ? 0.25 : 0.6,
              ease: EASE,
            }}
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

      {/* Layar PUTIH PENUH + efek glitch shutter & blur khas flash sebelum masuk ke website utama */}
      <AnimatePresence>
        {(isWhiteHold || (isRevealing && !leaving)) && (
          <motion.div
            key="camera-flash-veil"
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-[90] bg-white ${isWhiteHold ? 'efg-glitch-veil' : ''}`}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={
              isWhiteHold
                ? { opacity: 1, backdropFilter: 'blur(28px)' }
                : { opacity: 0, backdropFilter: 'blur(0px)' }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: isWhiteHold ? 0.14 : 0.95,
              ease: isRevealing ? EASE : [0.22, 1, 0.36, 1],
            }}
          >
            {isWhiteHold && <div className="efg-glitch-bars absolute inset-0 opacity-70 mix-blend-multiply" />}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

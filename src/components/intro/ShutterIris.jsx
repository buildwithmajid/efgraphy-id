import { forwardRef, useImperativeHandle, useRef } from 'react'

/**
 * Bilah diafragma (iris) layar penuh dalam SVG.
 * Dikendalikan secara imperatif: ref.current.close(ms) / ref.current.open(ms) → Promise.
 * Setiap bilah adalah bidang yang tepi dalamnya berjarak r dari pusat;
 * irisan semua bilah membentuk bukaan segi-8 yang mengecil sambil berputar.
 */

const BLADES = 8
const OPEN_R = 78 // cukup untuk menutupi sudut layar (viewBox 100×100, slice)
const TWIST = 48 // derajat putaran bilah saat menutup

const easeIn = (t) => t * t * t
const easeOut = (t) => 1 - Math.pow(1 - t, 4)

const ShutterIris = forwardRef(function ShutterIris(_, ref) {
  const svgRef = useRef(null)
  const bladeRefs = useRef([])
  const raf = useRef(0)

  const apply = (openness) => {
    const r = openness * OPEN_R
    const twist = (1 - openness) * TWIST
    bladeRefs.current.forEach((el, i) => {
      if (!el) return
      const angle = (i * 360) / BLADES + twist
      el.setAttribute('transform', `rotate(${angle}) translate(${r - 0.4} 0)`)
    })
    if (svgRef.current) svgRef.current.style.visibility = openness >= 0.999 ? 'hidden' : 'visible'
  }

  const run = (from, to, ms, ease) =>
    new Promise((resolve) => {
      cancelAnimationFrame(raf.current)
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / ms)
        apply(from + (to - from) * ease(p))
        if (p < 1) raf.current = requestAnimationFrame(tick)
        else resolve()
      }
      raf.current = requestAnimationFrame(tick)
    })

  useImperativeHandle(ref, () => ({
    close: (ms = 170) => run(1, 0, ms, easeIn),
    open: (ms = 520) => run(0, 1, ms, easeOut),
  }))

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
      style={{ visibility: 'hidden' }}
      viewBox="-50 -50 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="blade-shade" x1="0" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2a2724" />
          <stop offset="0.18" stopColor="#151413" />
          <stop offset="1" stopColor="#0b0a0a" />
        </linearGradient>
      </defs>
      {Array.from({ length: BLADES }, (_, i) => (
        <g key={i} ref={(el) => (bladeRefs.current[i] = el)} transform={`rotate(${(i * 360) / BLADES}) translate(${OPEN_R} 0)`}>
          <path d="M0 -140 L150 -140 L150 140 L0 140 Z" fill="url(#blade-shade)" />
          <path d="M0 -140 L0 140" stroke="#c2a67e" strokeOpacity="0.35" strokeWidth="0.25" />
          <path d="M0.9 -140 L0.9 140" stroke="#000" strokeOpacity="0.6" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  )
})

export default ShutterIris

import { useEffect, useRef } from 'react'

/**
 * Kartu 3D interaktif yang memiringkan permukaan sesuai posisi kursor
 * ditambah kilau cahaya lensa (specular sheen) halus.
 * Menggunakan mutasi DOM langsung lewat requestAnimationFrame (0 re-render React saat kursor bergerak).
 * Otomatis tidak aktif di perangkat sentuh (touch / coarse pointer).
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glare = true,
  glareColor = 'rgba(255,250,240,0.22)',
  ...props
}) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const handleMove = (e) => {
    if (e.pointerType === 'touch') return
    const el = cardRef.current
    if (!el) return
    const clientX = e.clientX
    const clientY = e.clientY

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width
      const py = (clientY - rect.top) / rect.height
      const rotateY = (px - 0.5) * maxTilt * 2
      const rotateX = (0.5 - py) * maxTilt * 2

      el.style.transition = 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale},${scale},1)`

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = '1'
        glareRef.current.style.background = `radial-gradient(circle 280px at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, ${glareColor}, transparent 65%)`
      }
    })
  }

  const handleLeave = () => {
    cancelAnimationFrame(rafRef.current)
    const el = cardRef.current
    if (el) {
      el.style.transition = 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    }
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  )
}

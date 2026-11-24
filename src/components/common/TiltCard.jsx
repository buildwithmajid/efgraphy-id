import { useRef, useState } from 'react'

/**
 * Kartu 3D interaktif yang memiringkan permukaan sesuai posisi kursor
 * ditambah kilau cahaya lensa (specular sheen) halus.
 * Otomatis tidak aktif di perangkat sentuh (touch / coarse pointer).
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glare = true,
  ...props
}) {
  const ref = useRef(null)
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
  })
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMove = (e) => {
    if (e.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * maxTilt * 2
    const rotateX = (0.5 - py) * maxTilt * 2

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale},${scale},1)`,
      transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
    })
    if (glare) setSheen({ x: px * 100, y: py * 100, opacity: 1 })
  }

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
    })
    if (glare) setSheen((s) => ({ ...s, opacity: 0 }))
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ ...style, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle 280px at ${sheen.x}% ${sheen.y}%, rgba(255,250,240,0.22), transparent 65%)`,
          }}
        />
      )}
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

/**
 * Katalog Portofolio 3D Curved Arc Showcase (terinspirasi Velto / Indaco / Stillhaus).
 * - Kartu tengah tajam penuh fokus, kartu di kiri & kanan melengkung mundur dalam ruang 3D
 *   dengan depth-of-field lembut seperti bukaan lensa kamera.
 * - Mendukung drag mouse/sentuh, klik kartu samping untuk fokus, klik kartu tengah untuk Lightbox.
 */
export default function Portfolio3DShowcase({ items, categoryMap, onOpenLightbox }) {
  const [active, setActive] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragRef = useRef({ active: false, startX: 0, moved: false })

  const count = items.length

  const go = useCallback(
    (delta) => {
      if (!count) return
      setActive((prev) => (prev + delta + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (active >= count && count > 0) setActive(0)
  }, [active, count])

  if (!count) return null

  const getRelativeOffset = (index) => {
    let diff = index - active
    if (diff > count / 2) diff -= count
    if (diff < -count / 2) diff += count
    return diff
  }

  const handlePointerDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, moved: false }
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    if (Math.abs(dx) > 10) dragRef.current.moved = true
    setDragOffset(Math.max(-220, Math.min(220, dx)))
  }

  const handlePointerUp = () => {
    if (!dragRef.current.active) return
    if (dragOffset < -55) go(1)
    else if (dragOffset > 55) go(-1)
    dragRef.current.active = false
    setDragOffset(0)
  }

  const currentItem = items[active]

  return (
    <section className="relative overflow-hidden bg-obsidian py-24 text-cream sm:py-32">
      {/* Cahaya studio redup di belakang galeri 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 48%, rgba(194,166,126,0.12), transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[15ch] font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.015em] text-cream">
            Karya pilihan di balik <em className="font-normal text-champagne">lensa</em> kami.
          </h2>
          <Link
            to="/portfolio"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-cream/20 px-5 text-[13px] font-medium text-cream transition-colors hover:border-champagne hover:text-champagne md:self-auto"
          >
            Lihat seluruh galeri
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Panggung 3D Curved Arc */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative mt-14 flex h-[410px] cursor-grab select-none items-center justify-center active:cursor-grabbing sm:h-[490px]"
          style={{ perspective: '1500px', touchAction: 'pan-y' }}
        >
          {items.map((item, idx) => {
            const rel = getRelativeOffset(idx)
            const shifted = rel + dragOffset / 260
            const abs = Math.abs(shifted)

            if (abs > 2.8) return null

            const isCenter = idx === active
            const translateX = shifted * 250
            const translateZ = -Math.pow(abs, 1.3) * 145
            const rotateY = shifted * -24
            const scale = Math.max(0.72, 1 - abs * 0.13)
            const opacity = Math.max(0.18, 1 - abs * 0.34)
            const blur = abs < 0.35 ? 0 : Math.min(3.5, (abs - 0.35) * 1.9)

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={isCenter ? `Buka foto ${item.title}` : `Fokus ke foto ${item.title}`}
                onClick={() => {
                  if (dragRef.current.moved) return
                  if (isCenter) onOpenLightbox?.(idx)
                  else setActive(idx)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (isCenter) onOpenLightbox?.(idx)
                    else setActive(idx)
                  }
                }}
                style={{
                  transform: `translate3d(${translateX.toFixed(1)}px, 0px, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                  opacity,
                  filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
                  zIndex: Math.round(30 - abs * 10),
                  transition: dragRef.current.active
                    ? 'none'
                    : 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease, filter 500ms ease',
                  willChange: 'transform, opacity',
                }}
                className="group absolute w-[250px] overflow-hidden rounded-sm border border-cream/20 bg-obsidian-soft shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] sm:w-[310px]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {isCenter && (
                    <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-cream/25 bg-obsidian/65 text-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Expand className="size-4" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Foto Aktif + Navigasi + Status Bar (Stillhaus style) */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-cream/12 pt-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-serif text-2xl font-medium text-cream">{currentItem.title}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/60">
              <span className="text-champagne">{categoryMap?.[currentItem.category_id] || 'Portofolio'}</span>
              {currentItem.location ? ` · ${currentItem.location}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/55 tabular-nums">
              DRAG · KLIK &nbsp;&nbsp; {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto sebelumnya"
                className="grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-champagne hover:text-champagne"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto berikutnya"
                className="grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-champagne hover:text-champagne"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

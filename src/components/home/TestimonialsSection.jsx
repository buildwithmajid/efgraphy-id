import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { safeExternalUrl } from '../../lib/safeUrl'

const FALLBACK_PRINTS = [
  '/portfolio/wedding-1.jpg',
  '/portfolio/prewedding-1.jpg',
  '/portfolio/engagement-1.jpg',
  '/portfolio/birthday-1.jpg',
]

function pickPhotoForTestimonial(item, idx, portfolios = []) {
  const hint = `${item.event_type || ''} ${item.quote || ''}`.toLowerCase()
  if (portfolios.length) {
    const match = portfolios.find((p) => {
      const hay = `${p.title || ''} ${p.image_url || ''}`.toLowerCase()
      if (hint.includes('prewed') && hay.includes('prewed')) return true
      if ((hint.includes('lamaran') || hint.includes('engage')) && (hay.includes('engage') || hay.includes('lamaran'))) return true
      if ((hint.includes('wedding') || hint.includes('nikah') || hint.includes('akad')) && hay.includes('wedding')) return true
      if ((hint.includes('wisuda') || hint.includes('birthday') || hint.includes('ulang')) && (hay.includes('birthday') || hay.includes('studio'))) return true
      return false
    })
    if (match?.image_url) return match.image_url
    return portfolios[idx % portfolios.length]?.image_url || FALLBACK_PRINTS[idx % FALLBACK_PRINTS.length]
  }
  return FALLBACK_PRINTS[idx % FALLBACK_PRINTS.length]
}

const STACK_LAYERS = [
  { x: 0, y: 0, z: 24, rotateZ: -2, rotateY: 0, scale: 1, opacity: 1, zIndex: 30 },
  { x: 22, y: 12, z: -30, rotateZ: 4.5, rotateY: -6, scale: 0.94, opacity: 0.88, zIndex: 20 },
  { x: -16, y: 22, z: -72, rotateZ: -5.5, rotateY: 7, scale: 0.88, opacity: 0.68, zIndex: 10 },
]

export default function TestimonialsSection({ testimonials, portfolios = [], settings }) {
  const [active, setActive] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const count = testimonials?.length || 0

  useEffect(() => {
    if (active >= count && count > 0) setActive(0)
  }, [active, count])

  const go = useCallback(
    (delta) => {
      if (count <= 1) return
      setActive((prev) => (prev + delta + count) % count)
    },
    [count],
  )

  if (!count) return null

  const current = testimonials[active] || testimonials[0]
  const visibleDepth = Math.min(count, 3)

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x, y })
  }

  return (
    <section className="border-t border-sand bg-cream-alt/55 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* Kolom Kiri: Tumpukan Kartu Foto 3D Polaroid Interaktif */}
        <div
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative mx-auto flex h-[370px] w-full max-w-[340px] items-center justify-center sm:h-[420px] sm:max-w-[380px] lg:col-span-5"
          style={{ perspective: '1200px' }}
        >
          {Array.from({ length: visibleDepth }).map((_, depth) => {
            const itemIdx = (active + depth) % count
            const item = testimonials[itemIdx]
            const layer = STACK_LAYERS[depth]
            const photoUrl = pickPhotoForTestimonial(item, itemIdx, portfolios)
            const isTop = depth === 0

            const extraRotY = isTop ? tilt.x * 11 : tilt.x * 4
            const extraRotX = isTop ? -tilt.y * 8 : -tilt.y * 3

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => (count > 1 ? go(1) : undefined)}
                aria-label={
                  count > 1
                    ? `Cerita dari ${item.client_name}, klik untuk lihat cerita berikutnya`
                    : `Cerita dari ${item.client_name}`
                }
                animate={{
                  x: layer.x,
                  y: layer.y,
                  scale: layer.scale,
                  opacity: layer.opacity,
                  rotateZ: layer.rotateZ,
                  rotateY: layer.rotateY + extraRotY,
                  rotateX: extraRotX,
                }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  zIndex: layer.zIndex,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className={`absolute w-[250px] rounded-sm border border-sand bg-paper p-2.5 pb-5 text-left shadow-[0_30px_64px_-24px_rgba(24,23,22,0.32)] sm:w-[288px] ${
                  count > 1 ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-cream-alt">
                  <img
                    src={photoUrl}
                    alt={`Dokumentasi ${item.event_type || 'klien'} Efgraphy.id`}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2 px-1">
                  <span className="truncate font-serif text-base font-medium text-ink">{item.client_name}</span>
                  {item.event_type && (
                    <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3">
                      {item.event_type}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Kolom Kanan: Kutipan Editorial Majalah + Navigasi */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[16ch] font-serif text-[clamp(2.1rem,4.6vw,3.3rem)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
              Cerita hangat dari klien kami.
            </h2>
            <a
              href={safeExternalUrl(settings?.maps_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 text-[13.5px] font-medium text-ink underline-offset-4 transition-colors hover:text-wa hover:underline"
            >
              Ulasan Google Maps
              <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="relative mt-8 min-h-[190px] border-t border-sand pt-8 sm:min-h-[210px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-serif text-[1.6rem] font-normal italic leading-[1.42] text-ink sm:text-[2rem]">
                  “{current.quote}”
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold text-ink">{current.client_name}</span>
                  {current.event_type && (
                    <>
                      <span className="text-sand">•</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                        {current.event_type}
                      </span>
                    </>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-sand pt-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 tabular-nums">
                KLIK FOTO ATAU GESER &nbsp;&nbsp; {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Testimoni sebelumnya"
                  className="grid size-11 place-items-center rounded-full border border-sand bg-paper text-ink transition-colors hover:border-ink"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Testimoni berikutnya"
                  className="grid size-11 place-items-center rounded-full border border-sand bg-paper text-ink transition-colors hover:border-ink"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

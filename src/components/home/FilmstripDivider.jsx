import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SPROCKET_COUNT = 26

function SprocketRow() {
  return (
    <div aria-hidden="true" className="flex items-center justify-between gap-3 px-2">
      {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
        <span
          key={i}
          className="h-2.5 w-4 shrink-0 rounded-[2px] border border-cream/12 bg-obsidian"
        />
      ))}
    </div>
  )
}

/**
 * Pita 35mm Contact Sheet / Filmstrip dalam perspektif 3D yang meluncur halus mengikuti scroll.
 * Berfungsi sebagai jembatan visual dari area terang (Layanan) ke ruang gelap studio (Portofolio 3D).
 */
export default function FilmstripDivider({ items = [], onOpenLightbox }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const trackX = useTransform(scrollYProgress, [0, 1], ['2%', '-16%'])
  const stripRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 4, -4])

  if (!items.length) return null

  // Duplikasi ringan agar pita tetap penuh di layar lebar
  const frames = items.length >= 6 ? [...items, ...items.slice(0, 4)] : [...items, ...items, ...items]

  return (
    <div
      ref={containerRef}
      aria-label="Cuplikan contact sheet 35mm Efgraphy.id"
      className="relative overflow-hidden bg-gradient-to-b from-cream via-obsidian to-obsidian py-8 sm:py-10"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX: stripRotateX,
          transformStyle: 'preserve-3d',
        }}
        className="-mx-8 -rotate-[1.25deg] border-y border-cream/15 bg-[#161513] py-2.5 shadow-[0_26px_60px_-20px_rgba(0,0,0,0.75)]"
      >
        <SprocketRow />

        <motion.div
          style={{ x: trackX, willChange: 'transform' }}
          className="my-2.5 flex items-center gap-3 px-4 sm:gap-4"
        >
          {frames.map((item, idx) => {
            const realIndex = idx % items.length
            const frameCode = `${String(idx + 1).padStart(2, '0')}A`

            return (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                onClick={() => onOpenLightbox?.(realIndex)}
                aria-label={`Lihat foto ${item.title}`}
                className="group relative w-[138px] shrink-0 overflow-hidden rounded-[2px] border border-cream/15 bg-obsidian p-1.5 text-left transition-colors duration-300 hover:border-champagne/70 sm:w-[172px]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-obsidian-soft">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-champagne/70 tabular-nums">
                  <span>EFG 400</span>
                  <span>{frameCode}</span>
                </div>
              </button>
            )
          })}
        </motion.div>

        <SprocketRow />
      </motion.div>
    </div>
  )
}

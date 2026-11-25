import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function FilmFrame({ item, frameCode, onClick, isDuplicate = false }) {
  return (
    <div className="flex w-[144px] shrink-0 flex-col gap-2 sm:w-[178px]">
      {/* Lubang sprocket atas menyatu dengan pita film */}
      <div aria-hidden="true" className="flex items-center justify-between px-1.5">
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
      </div>

      <button
        type="button"
        tabIndex={isDuplicate ? -1 : 0}
        onClick={onClick}
        aria-label={`Lihat foto ${item.title}`}
        className="group relative overflow-hidden rounded-[2px] border border-cream/15 bg-obsidian p-1.5 text-left transition-colors duration-300 hover:border-champagne/75"
      >
        <div className="aspect-[4/3] overflow-hidden bg-obsidian-soft">
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover opacity-88 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-champagne/70 tabular-nums">
          <span>EFG 400</span>
          <span>{frameCode}</span>
        </div>
      </button>

      {/* Lubang sprocket bawah menyatu dengan pita film */}
      <div aria-hidden="true" className="flex items-center justify-between px-1.5">
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
        <span className="h-2.5 w-4 rounded-[2px] border border-cream/12 bg-obsidian" />
      </div>
    </div>
  )
}

/**
 * Pita 35mm Contact Sheet / Filmstrip dalam perspektif 3D yang berputar mulus ke kiri tanpa putus.
 * Lubang sprocket dan frame bergerak serempak seperti gulungan film asli, dan otomatis jeda saat di-hover.
 */
export default function FilmstripDivider({ items = [], onOpenLightbox }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const stripRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 4, -4])

  if (!items.length) return null

  // Pastikan satu segmen cukup panjang menutup layar lebar agar loop 0% -> -50% mulus tanpa celah
  const baseSequence = items.length >= 6 ? items : [...items, ...items]

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
        className="efg-filmstrip-shell -mx-12 -rotate-[1.25deg] overflow-hidden border-y border-cream/15 bg-[#161513] py-2.5 shadow-[0_26px_60px_-20px_rgba(0,0,0,0.75)]"
      >
        <div className="efg-filmstrip-track flex w-max">
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              aria-hidden={copyIdx === 1}
              className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
            >
              {baseSequence.map((item, idx) => {
                const realIndex = idx % items.length
                const frameCode = `${String(idx + 1).padStart(2, '0')}A`

                return (
                  <FilmFrame
                    key={`${copyIdx}-${item.id}-${idx}`}
                    item={item}
                    frameCode={frameCode}
                    isDuplicate={copyIdx === 1}
                    onClick={() => onOpenLightbox?.(realIndex)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

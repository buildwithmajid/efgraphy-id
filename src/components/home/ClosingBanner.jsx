import { useEffect, useRef } from 'react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

/**
 * Tirai Penutup Editorial Gelap (Dark Editorial Closing Curtain) sebelum Footer.
 * Memberi klimaks visual dengan bingkai viewfinder 3D halus (mutasi ref rAF, 0 re-render).
 */
export default function ClosingBanner({ settings }) {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const rafRef = useRef(0)
  const waHref = buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const handleMove = (e) => {
    if (e.pointerType === 'touch') return
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return
    const clientX = e.clientX
    const clientY = e.clientY

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width - 0.5
      const y = (clientY - rect.top) / rect.height - 0.5
      frame.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
    })
  }

  const handleLeave = () => {
    cancelAnimationFrame(rafRef.current)
    if (frameRef.current) {
      frameRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative overflow-hidden border-t border-cream/10 bg-obsidian py-20 text-cream sm:py-28"
      style={{ perspective: '1200px' }}
    >
      {/* Cahaya studio hangat redup di belakang teks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 58% 55% at 50% 45%, rgba(194,166,126,0.14), transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div
          ref={frameRef}
          style={{
            transform: 'rotateX(0deg) rotateY(0deg)',
            transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-sm border border-cream/12 bg-obsidian-soft/75 px-6 py-14 text-center shadow-[0_36px_90px_-32px_rgba(0,0,0,0.85)] sm:px-12 sm:py-20"
        >
          {/* Sudut viewfinder halus (4 corner marks) */}
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-champagne/45" />
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-champagne/45" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-champagne/45" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-champagne/45" />

          <h2 className="mx-auto max-w-[16ch] font-serif text-[clamp(2.3rem,5.4vw,4rem)] font-medium leading-[1.03] tracking-[-0.02em] text-cream">
            Tanggal bagus cepat terisi. Yuk amankan <em className="font-normal text-champagne">harimu</em>.
          </h2>

          <p className="mx-auto mt-5 max-w-[50ch] text-[15px] leading-relaxed text-cream/70 sm:text-[16px]">
            Konsultasi konsep, cek ketersediaan jadwal, atau minta katalog pricelist lengkap langsung lewat WhatsApp
            tim Efgraphy.id.
          </p>

          <div className="mt-9 flex justify-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-wa px-7 text-sm font-medium text-white shadow-[0_18px_36px_-14px_rgba(31,110,67,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-hover"
            >
              <WhatsAppIcon className="size-[18px]" />
              Konsultasi &amp; Cek Tanggal
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

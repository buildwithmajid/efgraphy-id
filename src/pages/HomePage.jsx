import { motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import WhatsAppIcon from '../components/common/WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../lib/whatsapp'
import { fallbackSettings as settings } from '../data/fallbackData'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Pratinjau beranda (Fase 2) — tujuan transisi "cekrek".
 * Fase 3 akan mengganti ini dengan hero Z-depth, layanan, portofolio 3D, pricelist, dst.
 */
export default function HomePage({ revealed, onReplayIntro }) {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
    animate: revealed ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 1.1, delay, ease: EASE },
  })

  return (
    <div className="min-h-dvh bg-cream">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Efgraphy.id beranda">
          <img src="/logo-mark-dark.png" alt="" className="h-8 w-auto" />
          <span className="text-[15px] font-medium tracking-wide text-ink">efgraphy.id</span>
        </a>
        <a
          href={buildWaLink(WA_MESSAGES.consult, settings.whatsapp_number)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-cream transition-colors duration-300 hover:bg-wa"
        >
          <WhatsAppIcon className="size-4" />
          Booking via WA
        </a>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-88px)] max-w-7xl flex-col justify-center px-5 pb-16 sm:px-8">
        <motion.h1
          {...rise(0.05)}
          className="max-w-[14ch] font-serif text-[clamp(3.2rem,9vw,6rem)] font-medium leading-[0.92] tracking-[-0.02em] text-ink"
        >
          Setiap momen, <em className="font-normal text-ink-2">diabadikan</em> seindah rasanya.
        </motion.h1>
        <motion.p {...rise(0.2)} className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
          {settings.hero_subtitle}
        </motion.p>
        <motion.div {...rise(0.32)} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={buildWaLink(WA_MESSAGES.consult, settings.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-wa px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-wa-hover"
          >
            <WhatsAppIcon className="size-[18px]" />
            Konsultasi gratis via WhatsApp
          </a>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink"
          >
            Lihat karya di Instagram
            <ArrowUpRight className="size-4" strokeWidth={1.6} />
          </a>
        </motion.div>
        <motion.p {...rise(0.44)} className="mt-14 text-[13px] text-ink-3">
          {settings.service_area} · sejak {settings.founded_year}
        </motion.p>
      </main>

      <footer className="border-t border-sand">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-[13px] text-ink-3 sm:px-8">
          <span>© {new Date().getFullYear()} Efgraphy.id — Memory of Lens</span>
          <button
            type="button"
            onClick={onReplayIntro}
            className="inline-flex min-h-11 items-center gap-2 text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.6} />
            Putar ulang intro kamera
          </button>
        </div>
      </footer>
    </div>
  )
}

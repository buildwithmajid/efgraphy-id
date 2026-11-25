import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

function CornerMarks({ className = '', size = 'h-7 w-7' }) {
  const base = `absolute ${size} border-current`
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </div>
  )
}

function ExposureRuler({ side }) {
  const ticks = Array.from({ length: 13 }, (_, i) => i - 6)
  return (
    <div
      aria-hidden="true"
      className={`absolute top-1/2 hidden -translate-y-1/2 flex-col items-center gap-[9px] md:flex ${side === 'left' ? 'left-9' : 'right-9'}`}
    >
      {ticks.map((t) => {
        const major = t % 2 === 0
        return (
          <div key={t} className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <span className={`block h-px ${t === 0 ? 'w-5 bg-champagne' : major ? 'w-3.5 bg-cream/45' : 'w-2 bg-cream/25'}`} />
            {major && (
              <span className={`w-4 font-mono text-[10px] tabular-nums ${t === 0 ? 'text-champagne' : 'text-cream/40'} ${side === 'right' ? 'text-right' : ''}`}>
                {t > 0 ? `+${t / 2}` : t / 2}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ViewfinderHUD({ phase, ready, onCapture, onSkip }) {
  const aligning = phase === 'align' || phase === 'flash'
  const flashing = phase === 'flash'
  const busy = phase !== 'idle'

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 text-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? (flashing ? 0 : 1) : 0 }}
      transition={{ duration: flashing ? 0.22 : 0.8, ease: EASE }}
    >
      {/* bingkai viewfinder */}
      <CornerMarks className="inset-5 text-cream/30 sm:inset-8" />
      <ExposureRuler side="left" />
      <ExposureRuler side="right" />

      {/* bar atas */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 pt-8 sm:px-14 sm:pt-12">
        <div className="flex items-center gap-3">
          <img src="/logo-mark-light.png" alt="" className="h-7 w-auto opacity-90" />
          <span className="text-sm font-medium tracking-wide text-cream/90">efgraphy.id</span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          disabled={busy}
          className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-cream/15 px-4 text-[13px] text-cream/70 transition-colors duration-300 hover:border-cream/40 hover:text-cream disabled:opacity-0"
        >
          Lewati intro
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>

      {/* kotak autofokus yang mengunci tepat ke lensa saat kamera menghadap pengunjung */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={
          aligning
            ? { width: 'min(32vmin, 230px)', height: 'min(32vmin, 230px)', top: '37%', color: '#c2a67e' }
            : { width: 'min(58vw, 460px)', height: 'min(34vh, 250px)', top: '36%', color: 'rgba(250,248,245,0.38)' }
        }
        transition={{ duration: aligning ? 0.38 : 0.8, ease: EASE }}
      >
        <CornerMarks className="inset-0" size="h-4 w-4" />
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center font-mono text-[9.5px] uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.14em]">
          {aligning ? (
            '● SIAP MEMOTRET · SENYUM :)'
          ) : (
            <>
              <span className="sm:hidden">360° · GESER KAMERA · KETUK POTRET</span>
              <span className="hidden sm:inline">360° · ARAHKAN KURSOR KE KAMERA · KLIK UNTUK POTRET</span>
            </>
          )}
        </span>
      </motion.div>

      {/* bawah: tagline + tombol rana */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-6 text-center sm:pb-9"
        animate={{ opacity: aligning ? 0.25 : 1, y: aligning ? 10 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-medium italic leading-[0.98] tracking-[-0.01em] text-cream">
          Memory of Lens
        </h1>
        <p className="mt-1.5 max-w-[38ch] text-[13.5px] leading-relaxed text-cream/65 sm:text-[14.5px]">
          Foto &amp; video untuk hari-hari paling berharga, dari Kendal sampai Semarang.
        </p>

        <button
          type="button"
          onClick={onCapture}
          disabled={busy}
          aria-label="Ambil foto dan masuk ke website"
          className="group pointer-events-auto relative mt-4 grid size-[64px] place-items-center rounded-full border border-cream/35 transition-colors duration-300 hover:border-champagne disabled:cursor-default sm:mt-5 sm:size-[70px]"
        >
          <span className="block size-[48px] rounded-full bg-champagne shadow-[0_6px_18px_-6px_rgba(194,166,126,0.6)] transition-transform duration-300 ease-out group-hover:scale-[0.92] group-active:scale-[0.84] sm:size-[52px]" />
          <span className="absolute inset-0 animate-ping rounded-full border border-champagne/50 [animation-duration:2.4s] group-disabled:hidden" />
        </button>
        <p className="mt-2.5 text-[12.5px] text-cream/70">
          {aligning ? 'Mengambil foto…' : 'Tekan rana untuk masuk'}
          {!aligning && (
            <span className="hidden text-cream/45 sm:inline">
              {' '}· atau tekan <kbd className="rounded border border-cream/20 px-1.5 py-0.5 font-sans text-[11px]">Enter</kbd>
            </span>
          )}
        </p>
      </motion.div>

      {/* data eksposur */}
      <div className="absolute bottom-9 left-8 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55 sm:bottom-12 sm:left-14 lg:block">
        35mm&nbsp;&nbsp;ƒ/1.4&nbsp;&nbsp;1/250&nbsp;&nbsp;ISO 100&nbsp;&nbsp;{aligning ? '⚡ FLASH READY' : ''}
      </div>
      <div className="absolute bottom-9 right-8 hidden text-[12px] text-cream/55 sm:bottom-12 sm:right-14 lg:block">
        Pegandon, Kendal · sejak 2019
      </div>
    </motion.div>
  )
}

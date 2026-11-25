import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

const EASE = [0.16, 1, 0.3, 1]

export default function HeroSection({ settings, portfolios, revealed }) {
  const sectionRef = useRef(null)
  const backTiltRef = useRef(null)
  const frontTiltRef = useRef(null)
  const midTiltRef = useRef(null)
  const rafRef = useRef(0)
  const inView = useInView(sectionRef, { margin: '100px 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const frontY = useTransform(scrollYProgress, [0, 1], [0, -56])
  const midY = useTransform(scrollYProgress, [0, 1], [0, -96])
  const backY = useTransform(scrollYProgress, [0, 1], [0, -28])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const heroPrimary = portfolios?.[0]?.image_url || '/portfolio/wedding-1.jpg'
  const heroSecondary = portfolios?.[2]?.image_url || '/portfolio/prewedding-1.jpg'
  const heroDetail = portfolios?.[1]?.image_url || '/portfolio/wedding-2.jpg'

  const applyTilt = (x, y) => {
    if (backTiltRef.current) {
      backTiltRef.current.style.transform = `perspective(1200px) translate3d(${(x * -18).toFixed(1)}px, ${(y * -14).toFixed(1)}px, -90px) rotateY(${(-14 + x * 10).toFixed(1)}deg) rotateZ(-4deg)`
    }
    if (frontTiltRef.current) {
      frontTiltRef.current.style.transform = `perspective(1200px) translate3d(${(x * 16).toFixed(1)}px, ${(y * 12).toFixed(1)}px, 20px) rotateY(${(x * 12).toFixed(1)}deg) rotateX(${(-y * 8).toFixed(1)}deg)`
    }
    if (midTiltRef.current) {
      midTiltRef.current.style.transform = `perspective(1200px) translate3d(${(x * 32).toFixed(1)}px, ${(y * 24).toFixed(1)}px, 80px) rotateY(${(12 + x * 14).toFixed(1)}deg) rotateZ(3deg)`
    }
  }

  const handleMove = (e) => {
    if (e.pointerType === 'touch') return
    const section = sectionRef.current
    if (!section) return
    const clientX = e.clientX
    const clientY = e.clientY

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width - 0.5
      const y = (clientY - rect.top) / rect.height - 0.5
      applyTilt(x, y)
    })
  }

  const handleLeave = () => {
    cancelAnimationFrame(rafRef.current)
    applyTilt(0, 0)
  }

  const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  const idlePlayState = revealed && inView ? 'running' : 'paused'

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative overflow-hidden bg-cream pt-24 pb-14 sm:pt-28 sm:pb-16 lg:flex lg:min-h-[min(100dvh,800px)] lg:items-center lg:pt-20 lg:pb-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Kolom Teks Editorial */}
        <div className="relative z-20 lg:col-span-6">
          <motion.h1
            {...rise(0.05)}
            className="max-w-[13ch] font-serif text-[clamp(2.75rem,5.4vw,4.65rem)] font-medium leading-[0.95] tracking-[-0.025em] text-ink"
          >
            Setiap momen, <em className="font-normal text-ink-2">diabadikan</em> seindah rasanya.
          </motion.h1>

          <motion.p
            {...rise(0.18)}
            className="mt-5 max-w-[48ch] text-[15.5px] leading-[1.68] text-ink-2 sm:text-[16.5px]"
          >
            {settings?.hero_subtitle}
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-wa px-6 text-sm font-medium text-white shadow-[0_12px_28px_-12px_rgba(24,87,53,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-hover"
            >
              <WhatsAppIcon className="size-[18px]" />
              Konsultasi gratis via WhatsApp
            </a>
            <Link
              to="/portfolio"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 bg-paper/70 px-6 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-paper"
            >
              Jelajahi Portofolio
              <ArrowUpRight className="size-4" strokeWidth={1.6} />
            </Link>
          </motion.div>

          {/* Trust & Coverage Bar */}
          <motion.div
            {...rise(0.38)}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sand pt-5 text-[13px] text-ink-2"
          >
            <span>
              Berdiri sejak <strong className="font-semibold text-ink">{settings?.founded_year || '2019'}</strong>
            </span>
            <span className="text-sand">•</span>
            <span>Free Konsultasi</span>
            <span className="text-sand">•</span>
            <span>{settings?.service_area || 'Kendal · Semarang · Batang · Pekalongan'}</span>
          </motion.div>
        </div>

        {/* Kolom Panggung Foto 3D Z-Depth Weaving */}
        <motion.div
          {...rise(0.22)}
          className="relative mx-auto flex h-[400px] w-full max-w-[500px] items-center justify-center sm:h-[460px] lg:col-span-6 lg:h-[470px] xl:h-[510px]"
          style={{ perspective: '1400px' }}
        >
          {/* Circular Lens Reticle SVG di belakang komposisi foto (otomatis jeda saat off-screen) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 420 420"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 text-ink/15 sm:h-[400px] sm:w-[400px] xl:h-[430px] xl:w-[430px]"
          >
            <g
              style={{
                transformOrigin: '210px 210px',
                animation: 'efg-reticle-spin 54s linear infinite',
                animationPlayState: idlePlayState,
              }}
            >
              <circle cx="210" cy="210" r="196" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="210" cy="210" r="184" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 11" />
            </g>
            <circle cx="210" cy="210" r="168" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <line x1="210" y1="6" x2="210" y2="24" stroke="currentColor" strokeWidth="1" />
            <line x1="210" y1="396" x2="210" y2="414" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="210" x2="24" y2="210" stroke="currentColor" strokeWidth="1" />
            <line x1="396" y1="210" x2="414" y2="210" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Lapisan Belakang */}
          <motion.div style={{ y: backY }} className="absolute left-1 top-4 z-0 w-[42%] sm:left-2 sm:top-5">
            <div
              ref={backTiltRef}
              style={{
                transform: 'perspective(1200px) translate3d(0px, 0px, -90px) rotateY(-14deg) rotateZ(-4deg)',
                transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                style={{
                  animation: 'efg-float-alt 7.5s ease-in-out infinite',
                  animationPlayState: idlePlayState,
                }}
                className="overflow-hidden rounded-sm border border-sand bg-paper p-1.5 shadow-[0_24px_50px_-24px_rgba(24,23,22,0.28)]"
              >
                <img
                  src={heroDetail}
                  alt="Detail persiapan pengantin Efgraphy.id"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover opacity-85"
                />
              </div>
            </div>
          </motion.div>

          {/* Lapisan Utama Tengah (Tajam & Fokus) */}
          <motion.div style={{ y: frontY }} className="relative z-10 w-[54%] sm:w-[52%]">
            <div
              ref={frontTiltRef}
              style={{
                transform: 'perspective(1200px) translate3d(0px, 0px, 20px) rotateY(0deg) rotateX(0deg)',
                transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="overflow-hidden rounded-sm border border-paper bg-paper p-2 shadow-[0_36px_80px_-28px_rgba(24,23,22,0.35)]"
            >
              <div className="flex items-center justify-between px-1 pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3 sm:text-[10px]">
                <span>EFGRAPHY · 35MM</span>
                <span>ƒ/1.4</span>
              </div>
              <img
                src={heroPrimary}
                alt="Dokumentasi wedding adat Jawa oleh Efgraphy.id"
                fetchPriority="high"
                decoding="async"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Lapisan Depan Kanan Bawah (Floating 3D Z-plane) */}
          <motion.div style={{ y: midY }} className="absolute bottom-2 right-1 z-20 w-[37%] sm:bottom-3 sm:right-2 sm:w-[39%]">
            <div
              ref={midTiltRef}
              style={{
                transform: 'perspective(1200px) translate3d(0px, 0px, 80px) rotateY(12deg) rotateZ(3deg)',
                transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                style={{
                  animation: 'efg-float-slow 6.4s ease-in-out infinite',
                  animationPlayState: idlePlayState,
                }}
                className="overflow-hidden rounded-sm border border-sand bg-paper p-1.5 shadow-[0_28px_60px_-22px_rgba(24,23,22,0.32)]"
              >
                <img
                  src={heroSecondary}
                  alt="Prewedding golden hour Efgraphy.id"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

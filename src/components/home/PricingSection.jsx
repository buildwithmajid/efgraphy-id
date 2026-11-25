import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import TiltCard from '../common/TiltCard'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, formatRupiah, WA_MESSAGES } from '../../lib/whatsapp'

export default function PricingSection({ packages, settings }) {
  return (
    <section id="pricelist" className="scroll-mt-12 border-t border-sand bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
            Paket transparan, fleksibel sesuai kebutuhan acara.
          </h2>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
            Semua paket dapat disesuaikan dengan durasi, jumlah tim, maupun tambahan video highlight. Konsultasi dan
            cek tanggal gratis via WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, idx) => {
            const isPopular = Boolean(pkg.is_popular)
            const isStartFrom = pkg.price_mode === 'start_from' && pkg.starting_price
            const waText = pkg.wa_message || WA_MESSAGES.package(pkg.name)
            const waHref = buildWaLink(waText, settings?.whatsapp_number)
            const features = Array.isArray(pkg.features) ? pkg.features : []

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                <TiltCard
                  maxTilt={isPopular ? 6.5 : 4}
                  scale={isPopular ? 1.018 : 1.008}
                  glareColor={isPopular ? 'rgba(194,166,126,0.26)' : 'rgba(255,250,240,0.22)'}
                  className={`flex w-full flex-col justify-between rounded-sm border p-6 transition-colors duration-300 sm:p-7 ${
                    isPopular
                      ? 'border-champagne/45 bg-obsidian text-cream shadow-[0_32px_76px_-28px_rgba(24,23,22,0.68)]'
                      : 'border-sand bg-paper text-ink shadow-[0_18px_40px_-28px_rgba(24,23,22,0.16)] hover:border-champagne'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-[1.65rem] font-medium leading-tight">{pkg.name}</h3>
                        {pkg.subtitle && (
                          <p className={`mt-1 text-[13px] ${isPopular ? 'text-cream/65' : 'text-ink-2'}`}>
                            {pkg.subtitle}
                          </p>
                        )}
                      </div>
                      {isPopular && (
                        <span className="shrink-0 rounded-full border border-champagne/35 bg-champagne/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champagne">
                          Populer
                        </span>
                      )}
                    </div>

                    {/* Konsep Hybrid: Mulai dari Rp... ATAU Request Pricelist */}
                    <div
                      className={`mt-6 border-y py-5 ${
                        isPopular ? 'border-cream/12' : 'border-sand'
                      }`}
                    >
                      {isStartFrom ? (
                        <>
                          <p
                            className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${
                              isPopular ? 'text-cream/55' : 'text-ink-3'
                            }`}
                          >
                            Mulai dari
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                            {formatRupiah(pkg.starting_price)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p
                            className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${
                              isPopular ? 'text-champagne' : 'text-champagne-deep'
                            }`}
                          >
                            Custom &amp; Fleksibel
                          </p>
                          <p className="mt-1 font-serif text-2xl font-medium italic">Request Pricelist</p>
                        </>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className={`flex items-start gap-2.5 text-[13.5px] leading-snug ${
                            isPopular ? 'text-cream/80' : 'text-ink-2'
                          }`}
                        >
                          <Check
                            className={`mt-0.5 size-4 shrink-0 ${
                              isPopular ? 'text-champagne' : 'text-wa'
                            }`}
                            strokeWidth={1.8}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium transition-colors duration-300 ${
                      isPopular
                        ? 'bg-champagne text-obsidian hover:bg-cream'
                        : 'bg-ink text-cream hover:bg-wa'
                    }`}
                  >
                    <WhatsAppIcon className="size-4" />
                    {isStartFrom ? 'Booking via WhatsApp' : 'Minta Pricelist via WA'}
                  </a>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>

        {/* Banner Request Pricelist Lengkap (Dark Editorial Card) */}
        <div className="relative mt-10 overflow-hidden rounded-sm border border-cream/10 bg-obsidian p-7 text-cream shadow-[0_28px_70px_-30px_rgba(24,23,22,0.55)] sm:p-10">
          <svg
            aria-hidden="true"
            viewBox="0 0 280 280"
            className="pointer-events-none absolute -right-14 -top-14 size-64 text-champagne/12"
          >
            <circle cx="140" cy="140" r="126" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 7" />
            <circle cx="140" cy="140" r="96" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </svg>
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-serif text-2xl font-medium text-cream sm:text-3xl">
                Ingin lihat katalog pricelist lengkap atau paket custom?
              </h3>
              <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed text-cream/70">
                Kami juga melayani dokumentasi Tedhak Siten, Anniversary, Event Kampus/Instansi, dan paket bundling Foto
                + Video Reels.
              </p>
            </div>
            <a
              href={buildWaLink(WA_MESSAGES.pricelist, settings?.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full bg-champagne px-6 text-sm font-semibold text-obsidian transition-colors duration-300 hover:bg-cream"
            >
              <WhatsAppIcon className="size-4" />
              Request Pricelist Lengkap
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

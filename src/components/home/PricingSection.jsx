import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, formatRupiah, WA_MESSAGES } from '../../lib/whatsapp'

export default function PricingSection({ packages, settings }) {
  return (
    <section id="pricelist" className="scroll-mt-24 border-t border-sand bg-cream py-20 sm:py-28">
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

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, idx) => {
            const isPopular = Boolean(pkg.is_popular)
            const isStartFrom = pkg.price_mode === 'start_from' && pkg.starting_price
            const waText = pkg.wa_message || WA_MESSAGES.package(pkg.name)
            const waHref = buildWaLink(waText, settings?.whatsapp_number)
            const features = Array.isArray(pkg.features) ? pkg.features : []

            return (
              <motion.article
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col justify-between rounded-sm border p-6 transition-colors duration-300 sm:p-7 ${
                  isPopular
                    ? 'border-ink bg-obsidian text-cream shadow-[0_28px_70px_-30px_rgba(24,23,22,0.55)]'
                    : 'border-sand bg-paper text-ink hover:border-champagne'
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
                      <span className="shrink-0 rounded-full bg-champagne/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champagne">
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
              </motion.article>
            )
          })}
        </div>

        {/* Banner Request Pricelist Lengkap */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-sm border border-sand bg-cream-alt/80 p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h3 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              Ingin lihat katalog pricelist lengkap atau paket custom?
            </h3>
            <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed text-ink-2">
              Kami juga melayani dokumentasi Tedhak Siten, Anniversary, Event Kampus/Instansi, dan paket bundling Foto
              + Video Reels.
            </p>
          </div>
          <a
            href={buildWaLink(WA_MESSAGES.pricelist, settings?.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full bg-wa px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-wa-hover"
          >
            <WhatsAppIcon className="size-4" />
            Request Pricelist Lengkap
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

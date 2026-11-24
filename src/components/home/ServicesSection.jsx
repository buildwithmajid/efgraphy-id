import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import TiltCard from '../common/TiltCard'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, formatRupiah, WA_MESSAGES } from '../../lib/whatsapp'

const SERVICE_SLUGS = ['wedding', 'prewedding', 'engagement', 'birthday-wisuda']

const FALLBACK_COVERS = {
  wedding: '/placeholders/wedding-1.jpg',
  prewedding: '/placeholders/prewedding-1.jpg',
  engagement: '/placeholders/engagement-1.jpg',
  'birthday-wisuda': '/placeholders/birthday-1.jpg',
}

export default function ServicesSection({ categories, portfolios, packages, settings }) {
  const featuredCategories = SERVICE_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug),
  ).filter(Boolean)

  const getPriceTag = (categoryId) => {
    const pkg = packages.find((p) => p.category_id === categoryId)
    if (!pkg) return 'Request Pricelist'
    if (pkg.price_mode === 'start_from' && pkg.starting_price) {
      return `Mulai ${formatRupiah(pkg.starting_price)}`
    }
    return 'Request Pricelist'
  }

  const getCover = (cat) => {
    const found = portfolios.find((p) => p.category_id === cat.id)
    return found?.image_url || FALLBACK_COVERS[cat.slug] || '/placeholders/wedding-1.jpg'
  }

  return (
    <section id="layanan" className="border-t border-sand bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
            Layanan dokumentasi untuk setiap babak cerita.
          </h2>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink-2">
            Dari prosesi sakral hingga perayaan hangat bersama keluarga. Konsultasi konsep dan lokasi gratis sebelum
            booking.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {featuredCategories.map((cat, idx) => {
            const priceLabel = getPriceTag(cat.id)
            const waHref = buildWaLink(WA_MESSAGES.service(cat.name), settings?.whatsapp_number)

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={idx % 2 === 1 ? 'lg:mt-10' : ''}
              >
                <TiltCard
                  maxTilt={8}
                  scale={1.015}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-sand bg-paper transition-colors duration-300 hover:border-champagne/80"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream-alt">
                    <img
                      src={getCover(cat)}
                      alt={`Layanan foto ${cat.name} Efgraphy.id`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian/55 via-obsidian/15 to-transparent"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-cream/95 px-3 py-1 font-mono text-[11px] font-medium text-ink tabular-nums backdrop-blur-sm">
                      {priceLabel}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="font-serif text-[1.6rem] font-medium leading-tight text-ink">{cat.name}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{cat.description}</p>
                    </div>

                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-10 items-center justify-between border-t border-sand pt-3.5 text-[13px] font-medium text-ink transition-colors hover:text-wa"
                    >
                      <span className="inline-flex items-center gap-2">
                        <WhatsAppIcon className="size-3.5 text-wa" />
                        Tanya paket {cat.name}
                      </span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

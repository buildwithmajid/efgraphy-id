import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, RotateCcw } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'
import { safeExternalUrl } from '../../lib/safeUrl'

function InstagramIcon({ className = 'size-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default function Footer({ settings, onReplayIntro }) {
  const waHref = buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)

  return (
    <footer className="border-t border-sand bg-cream-alt/70">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-24 sm:px-8 sm:pb-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/logo-mark-dark.png" alt="" className="h-9 w-auto" />
              <div>
                <p className="text-[15px] font-semibold tracking-wide text-ink">efgraphy.id</p>
                <p className="font-serif text-sm italic text-ink-2">Memory of Lens</p>
              </div>
            </div>
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-2">
              Jasa fotografi dan videografi untuk wedding, prewedding, lamaran, birthday, dan wisuda sejak{' '}
              {settings?.founded_year || '2019'}. Melayani {settings?.service_area || 'Kendal · Semarang · Batang · Pekalongan'}.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-wa px-4 text-[13px] font-medium text-white transition-colors hover:bg-wa-hover"
              >
                <WhatsAppIcon className="size-3.5" />
                Chat WhatsApp
              </a>
              <a
                href={safeExternalUrl(settings?.instagram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-sand bg-paper px-4 text-[13px] text-ink transition-colors hover:border-ink"
              >
                <InstagramIcon className="size-3.5" />
                Instagram
              </a>
              <a
                href={safeExternalUrl(settings?.tiktok_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-sand bg-paper px-4 text-[13px] text-ink transition-colors hover:border-ink"
              >
                TikTok
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
              <li>
                <a href="/#layanan" className="transition-colors hover:text-ink">
                  Layanan Utama
                </a>
              </li>
              <li>
                <Link to="/portfolio" className="transition-colors hover:text-ink">
                  Galeri Portofolio
                </Link>
              </li>
              <li>
                <a href="/#pricelist" className="transition-colors hover:text-ink">
                  Pricelist &amp; Paket
                </a>
              </li>
              <li>
                <a href="/#lokasi" className="transition-colors hover:text-ink">
                  Lokasi &amp; Area Layanan
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">Studio Base</h3>
            <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-ink-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-champagne-deep" />
              <span>{settings?.address}</span>
            </p>
            <a
              href={safeExternalUrl(settings?.maps_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink underline-offset-4 hover:underline"
            >
              Buka di Google Maps
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6 text-[13px] text-ink-3">
          <span>© {new Date().getFullYear()} Efgraphy.id · Memory of Lens</span>
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="inline-flex min-h-10 items-center gap-2 text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.6} />
              Putar ulang intro kamera
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}

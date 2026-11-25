import { ArrowUpRight, MapPin } from 'lucide-react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'
import { safeExternalUrl } from '../../lib/safeUrl'

const AREAS = ['Kendal', 'Semarang', 'Batang', 'Pekalongan', 'Luar Kota (Request)']

export default function LocationSection({ settings }) {
  const waHref = buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)

  return (
    <section id="lokasi" className="scroll-mt-12 border-t border-sand bg-cream py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-[clamp(2.1rem,4.6vw,3.3rem)] font-medium leading-[1.08] tracking-[-0.015em] text-ink">
            Berbasis di Kendal, siap hadir hingga Semarang &amp; sekitarnya.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
            Acara kamu di luar Kendal? Tenang, tim Efgraphy.id rutin melayani pemotretan di Semarang, Batang,
            Pekalongan, hingga area Jawa Tengah lainnya.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full border border-sand bg-paper px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-sm border border-sand bg-paper p-5">
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
              <MapPin className="mt-0.5 size-4 shrink-0 text-champagne-deep" />
              <span>{settings?.address}</span>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-wa px-5 text-[13px] font-medium text-white transition-colors hover:bg-wa-hover"
              >
                <WhatsAppIcon className="size-4" />
                Cek Ketersediaan Tanggal
              </a>
              <a
                href={safeExternalUrl(settings?.maps_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-sand px-4 text-[13px] text-ink transition-colors hover:border-ink"
              >
                Petunjuk Arah
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-sm border border-sand bg-paper p-2 shadow-[0_24px_60px_-30px_rgba(24,23,22,0.18)]">
            <iframe
              title="Lokasi Studio Efgraphy.id di Pegandon, Kendal"
              src="https://www.google.com/maps?q=Jl.+KH.+Mukhsin,+Tegorejo,+Pegandon,+Kendal,+Jawa+Tengah+51357&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full rounded-sm border-0 grayscale-[20%] contrast-[1.03] sm:h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

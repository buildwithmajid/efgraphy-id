import { ArrowUpRight } from 'lucide-react'

export default function TestimonialsSection({ testimonials, settings }) {
  if (!testimonials?.length) return null

  return (
    <section className="border-t border-sand bg-cream-alt/55 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[15ch] font-serif text-[clamp(2.1rem,4.6vw,3.3rem)] font-medium leading-[1.08] tracking-[-0.015em] text-ink">
            Cerita hangat dari klien kami.
          </h2>
          <a
            href={settings?.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 text-[13.5px] font-medium text-ink underline-offset-4 transition-colors hover:text-wa hover:underline"
          >
            Tulis atau lihat ulasan di Google Maps
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {testimonials.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col justify-between rounded-sm border border-sand bg-paper p-7 sm:p-9"
            >
              <blockquote className="font-serif text-[1.6rem] font-normal italic leading-[1.4] text-ink sm:text-[1.85rem]">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-sand pt-4 text-sm">
                <span className="font-medium text-ink">{item.client_name}</span>
                {item.event_type && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                    {item.event_type}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

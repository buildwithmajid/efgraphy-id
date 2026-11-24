import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink } from '../../lib/whatsapp'

export default function LightboxModal({ items, index, onClose, onChange, categoryMap, whatsappNumber }) {
  const isOpen = index != null && items[index]
  const current = isOpen ? items[index] : null

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, index, items.length, onClose, onChange])

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-obsidian/95 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup tampilan foto"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-cream/15 bg-obsidian/70 text-cream transition-colors hover:border-cream/50 sm:right-6 sm:top-6"
          >
            <X className="size-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto sebelumnya"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index - 1 + items.length) % items.length)
                }}
                className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-cream/15 bg-obsidian/70 text-cream transition-colors hover:border-champagne sm:left-6"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Foto berikutnya"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index + 1) % items.length)
                }}
                className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-cream/15 bg-obsidian/70 text-cream transition-colors hover:border-champagne sm:right-6"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90dvh] w-full max-w-4xl flex-col items-center"
          >
            <div className="relative overflow-hidden rounded-sm border border-cream/12 bg-obsidian-soft">
              <img
                src={current.image_url}
                alt={current.title}
                className="max-h-[72dvh] w-auto object-contain"
              />
            </div>

            <div className="mt-4 flex w-full max-w-2xl flex-wrap items-center justify-between gap-4 px-1 text-cream">
              <div>
                <p className="font-serif text-xl font-medium sm:text-2xl">{current.title}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-cream/65">
                  <span className="font-mono uppercase tracking-[0.12em] text-champagne">
                    {categoryMap?.[current.category_id] || 'Portofolio'}
                  </span>
                  {current.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {current.location}
                    </span>
                  )}
                  <span className="font-mono tabular-nums text-cream/45">
                    {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                </p>
              </div>

              <a
                href={buildWaLink(
                  `Halo Efgraphy.id, saya suka banget konsep foto "${current.title}". Boleh konsultasi paket yang mirip seperti ini?`,
                  whatsappNumber,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-wa px-4 text-xs font-medium text-white transition-colors hover:bg-wa-hover"
              >
                <WhatsAppIcon className="size-3.5" />
                Tanya konsep ini via WA
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

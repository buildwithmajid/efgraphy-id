import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

const NAV_ITEMS = [
  { label: 'Layanan', href: '/#layanan' },
  { label: 'Portofolio', to: '/portfolio' },
  { label: 'Pricelist', href: '/#pricelist' },
  { label: 'Lokasi', href: '/#lokasi' },
]

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const waHref = buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'px-3 pt-3 sm:px-6' : 'px-0 pt-0'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'max-w-5xl rounded-full border border-sand/90 bg-cream/90 px-4 py-2.5 shadow-[0_10px_34px_-18px_rgba(24,23,22,0.2)] backdrop-blur-md sm:px-6'
            : 'max-w-7xl border-b border-transparent bg-transparent px-5 py-5 sm:px-8'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5" aria-label="Efgraphy.id Beranda">
          <img src="/logo-mark-dark.png" alt="" className="h-7 w-auto sm:h-8" />
          <span className="text-[15px] font-medium tracking-wide text-ink">efgraphy.id</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`text-[13.5px] transition-colors duration-200 ${
                  pathname === item.to ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-[13.5px] text-ink-2 transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-cream transition-colors duration-300 hover:bg-wa sm:px-5"
          >
            <WhatsAppIcon className="size-3.5" />
            <span>Booking WA</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-sand bg-paper/80 text-ink transition-colors hover:border-ink md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-3 mt-2 overflow-hidden rounded-2xl border border-sand bg-paper/98 p-4 shadow-[0_20px_50px_-20px_rgba(24,23,22,0.22)] backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col divide-y divide-sand/70">
              {NAV_ITEMS.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="py-3.5 text-[15px] font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3.5 text-[15px] font-medium text-ink"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

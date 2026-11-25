import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

const NAV_ITEMS = [
  { label: 'Layanan', sectionId: 'layanan' },
  { label: 'Portofolio', to: '/portfolio' },
  { label: 'Pricelist', sectionId: 'pricelist' },
  { label: 'Lokasi', sectionId: 'lokasi' },
]

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault()
    setOpen(false)
    if (pathname !== '/') {
      navigate(`/#${sectionId}`)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const waHref = buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-b from-cream/95 via-cream/60 to-transparent px-3 pt-2.5 pb-1 sm:bg-none sm:px-6 sm:pt-3 sm:pb-0'
          : 'px-0 pt-0'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-2 transition-all duration-500 ${
          scrolled
            ? 'max-w-5xl rounded-full border border-sand/90 bg-cream/95 px-3.5 py-2 shadow-[0_10px_34px_-18px_rgba(24,23,22,0.2)] backdrop-blur-md sm:px-6 sm:py-2.5'
            : 'max-w-7xl border-b border-transparent bg-transparent px-4 py-4 sm:px-8 sm:py-5'
        }`}
      >
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label="Efgraphy.id Beranda"
        >
          <img src="/logo-mark-dark.png" alt="" className="h-7 w-auto shrink-0 sm:h-8" />
          <span className="whitespace-nowrap text-[14px] font-medium tracking-wide text-ink sm:text-[15px]">
            efgraphy.id
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`whitespace-nowrap text-[13.5px] transition-colors duration-200 ${
                  pathname === item.to ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={`/#${item.sectionId}`}
                onClick={(e) => handleSectionClick(e, item.sectionId)}
                className="whitespace-nowrap text-[13.5px] text-ink-2 transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3.5 text-[12.5px] font-medium text-cream transition-colors duration-300 hover:bg-wa sm:min-h-10 sm:gap-2 sm:px-5 sm:text-[13px]"
          >
            <WhatsAppIcon className="size-3.5 shrink-0" />
            <span className="sm:hidden">Chat WA</span>
            <span className="hidden sm:inline">Booking WA</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-sand bg-paper/90 text-ink transition-colors hover:border-ink sm:size-10 md:hidden"
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
                    href={`/#${item.sectionId}`}
                    onClick={(e) => handleSectionClick(e, item.sectionId)}
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

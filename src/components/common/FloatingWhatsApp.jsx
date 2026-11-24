import WhatsAppIcon from './WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

export default function FloatingWhatsApp({ whatsappNumber }) {
  const href = buildWaLink(WA_MESSAGES.consult, whatsappNumber)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konsultasi via WhatsApp Efgraphy.id"
      className="group fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-wa px-4 text-sm font-medium text-white shadow-[0_14px_30px_-10px_rgba(24,87,53,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa-hover sm:px-5"
    >
      <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
      <span className="hidden sm:inline">Chat WA</span>
    </a>
  )
}

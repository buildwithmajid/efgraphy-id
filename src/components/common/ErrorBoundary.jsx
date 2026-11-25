import { Component } from 'react'
import { RotateCcw } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../../lib/whatsapp'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="grid min-h-dvh place-items-center bg-cream px-5 py-16 text-center text-ink">
        <div className="max-w-md">
          <img src="/logo-mark-dark.png" alt="" className="mx-auto h-10 w-auto opacity-85" />
          <h1 className="mt-6 font-serif text-3xl font-medium text-ink sm:text-4xl">
            Maaf, tampilan sempat terganggu.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Silakan muat ulang halaman, atau langsung hubungi tim Efgraphy.id lewat WhatsApp untuk konsultasi dan
            pricelist.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-cream transition-colors hover:bg-obsidian-soft"
            >
              <RotateCcw className="size-4" />
              Muat Ulang
            </button>
            <a
              href={buildWaLink(WA_MESSAGES.consult)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-wa px-6 text-sm font-medium text-white transition-colors hover:bg-wa-hover"
            >
              <WhatsAppIcon className="size-4" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    )
  }
}

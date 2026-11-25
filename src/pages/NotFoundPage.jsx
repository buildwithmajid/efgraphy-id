import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { fallbackSettings } from '../data/fallbackData'

export default function NotFoundPage({ onReplayIntro }) {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan | Efgraphy.id'
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <Navbar settings={fallbackSettings} />

      <main className="mx-auto flex flex-1 max-w-3xl flex-col items-center justify-center px-5 pt-28 pb-20 text-center sm:px-8">
        <h1 className="font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-ink">
          Halaman tidak ditemukan.
        </h1>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-2">
          Kode 404. Tautan yang kamu buka mungkin sudah dipindahkan atau salah ketik. Silakan kembali ke beranda atau
          jelajahi galeri karya Efgraphy.id.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-cream transition-colors hover:bg-wa"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 bg-paper px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Jelajahi Portofolio
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </main>

      <Footer settings={fallbackSettings} onReplayIntro={onReplayIntro} />
    </div>
  )
}

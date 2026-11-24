import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Image, MessageSquareQuote, Package, RotateCcw, Settings } from 'lucide-react'
import {
  getAdminPackages,
  getAdminPortfolios,
  getAdminTestimonials,
  resetDemoData,
} from '../../services/cmsService'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboardPage() {
  const { isSupabaseConfigured } = useAuth()
  const [stats, setStats] = useState({ portfolios: 0, featured: 0, packages: 0, testimonials: 0 })
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)
    try {
      const [pf, pk, ts] = await Promise.all([
        getAdminPortfolios(),
        getAdminPackages(),
        getAdminTestimonials(),
      ])
      setStats({
        portfolios: pf.length,
        featured: pf.filter((p) => p.is_featured).length,
        packages: pk.filter((p) => p.is_active).length,
        testimonials: ts.filter((t) => t.is_active).length,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleResetDemo = () => {
    if (!window.confirm('Reset semua perubahan demo lokal kembali ke data awal?')) return
    resetDemoData()
    loadStats()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Dashboard CMS</h1>
          <p className="mt-1 text-sm text-ink-2">
            Kelola galeri foto, paket harga, testimoni, dan nomor WhatsApp Efgraphy.id dari satu tempat.
          </p>
        </div>
        {!isSupabaseConfigured && (
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sand bg-paper px-3 text-xs font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            <RotateCcw className="size-3.5" />
            Reset Data Demo
          </button>
        )}
      </div>

      {/* Ringkasan Angka */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Foto Portofolio', value: stats.portfolios, sub: `${stats.featured} tampil di beranda`, to: '/admin/portfolio' },
          { label: 'Paket Aktif', value: stats.packages, sub: 'Mulai dari & Request Pricelist', to: '/admin/packages' },
          { label: 'Testimoni Aktif', value: stats.testimonials, sub: 'Tampil di halaman depan', to: '/admin/testimonials' },
          {
            label: 'Status Penyimpanan',
            value: isSupabaseConfigured ? 'Cloud' : 'Lokal',
            sub: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Demo Browser',
            to: '/admin/settings',
          },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="rounded-lg border border-sand bg-paper p-5 transition-colors hover:border-champagne"
          >
            <p className="text-xs font-medium text-ink-2">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {loading ? '—' : item.value}
            </p>
            <p className="mt-1 text-xs text-ink-3">{item.sub}</p>
          </Link>
        ))}
      </div>

      {/* Aksi Cepat */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'Upload & Kelola Foto Portofolio',
            desc: 'Tambahkan karya Wedding, Prewedding, Engagement, atau Birthday/Wisuda. Foto otomatis dikompres agar ringan.',
            to: '/admin/portfolio',
            icon: Image,
            action: 'Kelola Portofolio',
          },
          {
            title: 'Atur Paket & Mode Harga Hybrid',
            desc: 'Ubah nominal "Mulai dari Rp..." atau ubah paket menjadi "Request Pricelist", atur fitur & pesan WA khusus.',
            to: '/admin/packages',
            icon: Package,
            action: 'Kelola Paket',
          },
          {
            title: 'Kelola Testimoni Klien',
            desc: 'Tambahkan ulasan dari WhatsApp, Instagram, atau TikTok klien agar kepercayaan pengunjung makin tinggi.',
            to: '/admin/testimonials',
            icon: MessageSquareQuote,
            action: 'Kelola Testimoni',
          },
          {
            title: 'Pengaturan Nomor WA & Info Studio',
            desc: 'Perbarui nomor WhatsApp tujuan booking, teks utama hero, alamat studio, serta link Instagram & TikTok.',
            to: '/admin/settings',
            icon: Settings,
            action: 'Buka Pengaturan',
          },
        ].map(({ title, desc, to, icon: Icon, action }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col justify-between rounded-lg border border-sand bg-paper p-6 transition-colors hover:border-ink"
          >
            <div>
              <Icon className="size-5 text-champagne-deep" strokeWidth={1.75} />
              <h2 className="mt-3 text-base font-semibold text-ink">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{desc}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
              {action}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

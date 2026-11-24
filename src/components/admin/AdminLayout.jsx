import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Film,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portofolio Foto', icon: Image },
  { to: '/admin/videos', label: 'Video & Reels', icon: Film },
  { to: '/admin/packages', label: 'Paket & Harga', icon: Package },
  { to: '/admin/testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut, isSupabaseConfigured } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navContent = (
    <nav className="flex flex-col gap-1" aria-label="Navigasi Admin">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-obsidian text-cream'
                : 'text-ink-2 hover:bg-cream-alt hover:text-ink'
            }`
          }
        >
          <Icon className="size-4 shrink-0" strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-dvh bg-cream text-ink lg:flex">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-sand bg-paper p-5 lg:flex">
        <div>
          <Link to="/admin" className="flex items-center gap-2.5 px-2 py-1">
            <img src="/logo-mark-dark.png" alt="" className="h-7 w-auto" />
            <div>
              <p className="text-sm font-semibold leading-none text-ink">efgraphy.id</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">Admin CMS</p>
            </div>
          </Link>

          <div className="mt-6">{navContent}</div>
        </div>

        <div className="space-y-3 border-t border-sand pt-4">
          <div className="rounded-lg bg-cream-alt px-3 py-2.5">
            <p className="truncate text-xs font-medium text-ink">{user?.email}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
              {isSupabaseConfigured ? '● Supabase Aktif' : '● Mode Demo Lokal'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand bg-paper px-3 text-xs font-medium text-ink transition-colors hover:border-ink"
            >
              Lihat Web
              <ArrowUpRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-sand px-3 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
              aria-label="Keluar"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Topbar Mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sand bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo-mark-dark.png" alt="" className="h-6 w-auto" />
          <span className="text-sm font-semibold text-ink">Admin Efgraphy</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-sand px-2.5 text-xs font-medium text-ink"
          >
            Web
            <ArrowUpRight className="size-3" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu admin"
            className="grid size-9 place-items-center rounded-lg border border-sand text-ink"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Drawer Mobile */}
      {menuOpen && (
        <div className="border-b border-sand bg-paper p-4 lg:hidden">
          {navContent}
          <div className="mt-4 flex items-center justify-between border-t border-sand pt-3">
            <span className="truncate text-xs text-ink-2">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-danger"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1">
        {!isSupabaseConfigured && (
          <div className="border-b border-champagne/40 bg-champagne/15 px-5 py-2.5 text-xs text-ink sm:px-8">
            <strong>Mode Demo Lokal:</strong> Perubahan tersimpan di browser ini dan langsung tampil di website publik.
            Untuk sinkronisasi online permanen, isi <code className="font-mono">VITE_SUPABASE_URL</code> dan{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> di file <code className="font-mono">.env</code>.
          </div>
        )}
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

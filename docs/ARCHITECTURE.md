# Architecture & Technical Blueprint — Efgraphy.id

Dokumen ini menjelaskan arsitektur teknis untuk aplikasi **Efgraphy.id** menggunakan **React (Vite, JavaScript) + Tailwind CSS + Supabase**.

---

## 1. Tech Stack

| Lapisan | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Build Tool & UI** | React 18/19 + Vite (JavaScript `.jsx`) | Ringan, *hot-reload* cepat, ekosistem luas, mudah dikelola. |
| **3D Engine & WebGL** | `three` + `@react-three/fiber` + `@react-three/drei` | Membangun kamera 3D prosedural interaktif (body, dial metalik, lensa kaca, studio lighting) tanpa bergantung pada file `.glb` berukuran besar. |
| **Motion & 3D Interactions** | `framer-motion` | Transisi shutter "cekrek", scroll-linked Z-depth parallax, 3D curved portfolio showcase, magnetic tilt cards, dan page transitions 60fps. |
| **Styling** | Tailwind CSS + Google Fonts (*Cormorant Garamond*, *Plus Jakarta Sans*, *JetBrains Mono*) | Konsistensi token dari `DESIGN.md`, cepat membangun layout responsif. |
| **Routing** | `react-router-dom` | Memisahkan halaman publik (`/`, `/portfolio`) dan rute terlindungi (`/admin/*`). |
| **Icons** | `lucide-react` | Ikon minimalis garis tipis yang cocok dengan gaya editorial. |
| **Backend / CMS** | Supabase (`@supabase/supabase-js`) | Menyediakan PostgreSQL, Auth (Admin Login), dan Storage (Upload Foto) dalam satu platform gratis untuk skala UMKM. |
| **Hosting** | Vercel / Netlify (Frontend) + Supabase Cloud | Deploy otomatis dari Git, HTTPS gratis, mudah dihubungkan ke domain `efgraphy.id`. |

---

## 2. Struktur Folder Proyek

```text
Efgraphy.id/
├── DESIGN.md                  # Panduan sistem desain & token visual
├── docs/
│   ├── PRD.md                 # Product Requirements Document
│   ├── ARCHITECTURE.md        # Dokumen arsitektur teknis ini
│   └── ROADMAP.md             # Tahapan implementasi & checklist
├── public/
│   ├── logo.png               # Logo resmi Efgraphy.id (disediakan owner)
│   └── favicon.svg
├── supabase/
│   └── schema.sql             # SQL siap pakai: tabel, RLS policies, storage bucket, seed data
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Konfigurasi routing publik & admin
│   ├── index.css              # Tailwind directives & custom design tokens
│   ├── lib/
│   │   ├── supabase.js        # Inisialisasi Supabase client + deteksi mode konfigurasi
│   │   └── whatsapp.js        # Helper pembuat URL direct WhatsApp + format Rupiah
│   ├── data/
│   │   └── fallbackData.js    # Data default/placeholder jika Supabase belum terhubung
│   ├── services/
│   │   └── cmsService.js      # Layer akses data (fetch & CRUD portofolio, paket, testimoni, settings)
│   ├── context/
│   │   └── AuthContext.jsx    # State autentikasi admin Supabase
│   ├── components/
│   │   ├── common/            # Navbar, Footer, FloatingWhatsApp, ProtectedRoute
│   │   ├── home/              # Hero, TrustStrip, ServicesSection, PortfolioPreview, PricingSection, TestimonialsSection, LocationSection
│   │   ├── portfolio/         # CategoryFilter, PortfolioGrid, LightboxModal
│   │   └── admin/             # AdminLayout, ImageUploader
│   └── pages/
│       ├── HomePage.jsx
│       ├── PortfolioPage.jsx
│       └── admin/
│           ├── AdminLoginPage.jsx
│           ├── AdminDashboardPage.jsx
│           ├── AdminPortfolioPage.jsx
│           ├── AdminPackagesPage.jsx
│           ├── AdminTestimonialsPage.jsx
│           └── AdminSettingsPage.jsx
├── .env.example               # Template VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
├── index.html                 # Meta SEO, Open Graph, Google Fonts, JSON-LD LocalBusiness
└── package.json
```

---

## 3. Skema Database & Keamanan (Supabase RLS)

### Tabel Utama
1. **`categories`** (`id`, `name`, `slug`, `description`, `sort_order`)
2. **`portfolios`** (`id`, `category_id`, `title`, `image_url`, `location`, `is_featured`, `sort_order`, `created_at`)
3. **`packages`** (`id`, `category_id`, `name`, `subtitle`, `price_mode` [`start_from` | `request_pricelist`], `starting_price`, `features` [`jsonb`], `wa_message`, `is_popular`, `is_active`, `sort_order`)
4. **`testimonials`** (`id`, `client_name`, `event_type`, `quote`, `is_active`, `created_at`)
5. **`site_settings`** (`key` PK, `value`, `updated_at`)

### Storage Bucket
- Bucket publik: **`portfolio-images`**
- Publik dapat membaca (`SELECT`) gambar untuk ditampilkan di website.
- Hanya user terautentikasi (`authenticated`) yang dapat mengunggah (`INSERT`), memperbarui (`UPDATE`), dan menghapus (`DELETE`) file gambar.

### Row Level Security (RLS) Matrix
| Tabel | Pengunjung Publik (`anon`) | Admin Login (`authenticated`) |
| :--- | :--- | :--- |
| `categories` | `SELECT` | `ALL` (Select, Insert, Update, Delete) |
| `portfolios` | `SELECT` | `ALL` |
| `packages` | `SELECT` (hanya `is_active = true`) | `ALL` |
| `testimonials` | `SELECT` (hanya `is_active = true`) | `ALL` |
| `site_settings` | `SELECT` | `ALL` |

> **Catatan Keamanan:** Registrasi publik (*Public Sign-Up*) di Supabase Auth sebaiknya **dinonaktifkan** melalui Dashboard Supabase setelah akun admin owner dibuat, sehingga tidak ada orang luar yang bisa mendaftar sebagai admin.

---

## 4. Mode Fallback (Development Tanpa Supabase)

Agar website dapat langsung dijalankan dan ditinjau tampilannya sebelum akun Supabase disiapkan:
- `src/lib/supabase.js` memeriksa apakah `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah terisi.
- Jika **belum terisi**, `cmsService.js` otomatis menggunakan `fallbackData.js` untuk menampilkan konten publik yang lengkap (4 layanan, galeri placeholder editorial, paket hybrid, dan testimoni).
- Di halaman `/admin`, sistem akan menampilkan panduan singkat untuk menghubungkan `.env` Supabase.

---

## 5. Konfigurasi Deployment (Vercel + Custom Domain)

1. Push kode ke repository GitHub.
2. Import repository ke **Vercel** (preset otomatis terdeteksi: *Vite*).
3. Tambahkan file `vercel.json` berisi rewrite SPA (`"/(.*)" -> "/index.html"`) agar direct link ke `/portfolio` atau `/admin` tidak mengalami error 404.
4. Masukkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di dashboard Vercel.
5. Hubungkan domain `efgraphy.id` melalui DNS Vercel setelah domain resmi diaktifkan.

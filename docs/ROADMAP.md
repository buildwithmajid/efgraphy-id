# Implementation Roadmap — Efgraphy.id (3D Interactive Editorial)

Panduan bertahap pembangunan website **Efgraphy.id** dengan pengalaman **3D Camera Intro**, **Interactive 3D Portfolio**, **Direct WhatsApp Booking**, dan **Supabase CMS**.

---

## Fase 1 — Fondasi Proyek, 3D Stack & Sistem Desain
- [x] Inisialisasi proyek **React + Vite (JavaScript)** dan instalasi dependensi (`tailwindcss`, `react-router-dom`, `lucide-react`, `@supabase/supabase-js`, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`).
- [x] Konfigurasi tema Tailwind & token warna/tipografi sesuai `DESIGN.md` (*Cormorant Garamond*, *Plus Jakarta Sans*, *JetBrains Mono*).
- [x] Pasang meta SEO, Open Graph, dan JSON-LD LocalBusiness di `index.html`.
- [x] Buat helper `whatsapp.js`, `shutterSound.js` (Web Audio API), konfigurasi `supabase.js`, data awal `fallbackData.js`, dan `supabase/schema.sql`.

## Fase 2 — 3D Camera Intro & Shutter "Cekrek" Experience
- [x] Bangun model **Kamera 3D Prosedural** (`CameraModel.jsx`) di React Three Fiber (bodi matte charcoal/leatherette, ring lensa champagne metalik, elemen kaca lensa berlapis, studio rim lighting, pointer-follow inertia).
- [x] Bangun **Camera Viewfinder HUD** (`f/1.4 · 1/250s · ISO 100`, fokus reticle, tombol `Tekan rana untuk masuk` & `Lewati intro`).
- [x] Bangun **Animasi Transisi "Cekrek"** (3D zoom-in ke lensa → *shutter iris blade* + *white flash* + suara klik shutter halus → reveal ke halaman utama + manajemen `sessionStorage`).

## Fase 3 — Website Publik 3D Editorial & Direct WhatsApp
- [x] Bangun layout global: **Floating Glass Editorial Navbar** (responsif + logo), **Footer** (termasuk tombol *Replay 3D Intro*), dan **Floating WhatsApp Button**.
- [x] Bangun **Hero Editorial Z-Depth Weaving** (tipografi *Memory of Lens* + kartu foto berperspektif melayang di depan/belakang teks + lens reticle SVG).
- [x] Bangun **Trust & Coverage Strip** (Sejak 2019 · Free Konsultasi · Kendal–Semarang–Batang–Pekalongan).
- [x] Bangun **4 Layanan Utama dengan 3D Tilt Cards** (Wedding, Prewedding, Engagement, Birthday/Wisuda) + Direct WhatsApp CTA.
- [x] Bangun **3D Curved Arc Portfolio Showcase** di Beranda (drag/klik 3D carousel + depth-of-field + status bar `DRAG · KLIK  01 / 08`).
- [x] Bangun **Halaman Galeri Portofolio (`/portfolio`)** dengan filter kategori, **3D Magnetic Tilt Cards**, dan **Lightbox Modal** layar penuh.
- [x] Bangun **Section Pricelist Hybrid** (`Mulai dari Rp...` & `Request Pricelist via WA`), **Testimoni**, dan **Lokasi Google Maps**.

## Fase 4 — Admin Panel / CMS (`/admin`)
- [x] Bangun **AuthContext**, **ProtectedRoute**, dan halaman **Login Admin (`/admin/login`)**.
- [x] Bangun **Admin Dashboard** & navigasi sidebar (responsif desktop + mobile, termasuk Mode Demo Lokal sebelum `.env` Supabase diisi).
- [x] Bangun **CRUD Portofolio** dengan fitur kompresi otomatis WebP + upload gambar ke Supabase Storage + preview instan.
- [x] Bangun **CRUD Paket & Pricelist** (toggle `Mulai dari Rp...` vs `Request Pricelist`, daftar fitur, & template pesan WA).
- [x] Bangun **CRUD Testimoni** dan **Pengaturan Website** (nomor WA, teks Hero, link sosmed).

## Fase 5 — Integrasi Aset Asli, Optimasi 3D & Peluncuran
- [x] Setup project Supabase (`efgraphy-id`), jalankan `supabase/schema.sql` & data awal, buat akun admin owner (`admin@efgraphy.id`), nonaktifkan *public sign-up*, dan isi `.env`.
- [x] Pasang logo resmi (`public/logo-*.png`) serta 8 foto karya asli `@efgraphy.id` (`public/portfolio/`) dan 5 link Video & Reels.
- [x] Verifikasi visual, performa 3D, dan koneksi live Supabase di website produksi (zero console errors).
- [x] Deploy ke Vercel (`https://efgraphy-id.vercel.app/`) dengan `vercel.json` SPA routing — siap dihubungkan ke domain `efgraphy.id`.

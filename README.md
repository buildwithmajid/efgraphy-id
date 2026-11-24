# Efgraphy.id — *Memory of Lens*

Website Company Profile, Portofolio 3D Interaktif, Direct WhatsApp Booking, dan Admin Panel CMS untuk **Efgraphy.id** — jasa fotografi & videografi (*All Event*) berbasis di Pegandon, Kendal (melayani Kendal, Semarang, Batang, Pekalongan & sekitarnya).

---

## Tech Stack

- **Frontend:** React 19 + Vite (JavaScript) + React Router
- **3D & Animasi:** Three.js (`@react-three/fiber`, `@react-three/drei`) + Framer Motion
- **Styling & Tipografi:** Tailwind CSS v4 + Self-hosted Fonts (*Cormorant Garamond*, *Plus Jakarta Sans*, *JetBrains Mono*)
- **Backend / CMS:** Supabase (Auth, PostgreSQL + RLS, Storage)

---

## Dokumentasi Proyek

- [Product Requirements Document (`docs/PRD.md`)](./docs/PRD.md)
- [3D Editorial Design System (`DESIGN.md`)](./DESIGN.md)
- [Arsitektur Teknis & Database (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Roadmap Implementasi (`docs/ROADMAP.md`)](./docs/ROADMAP.md)
- [Skema Database & RLS Supabase (`supabase/schema.sql`)](./supabase/schema.sql)

---

## Status Pengembangan

- [x] **Fase 1:** Fondasi proyek React + Vite + Tailwind v4, font self-hosted, SEO/JSON-LD, helper Direct WhatsApp, sintesis suara rana Web Audio API, data fallback, dan skema Supabase.
- [x] **Fase 2:** Panggung **Kamera 3D Prosedural** (putar 360° interaktif mengikuti kursor + detail panel belakang) dengan animasi balik lurus ke depan → kilatan *starburst* flash dari kamera → layar putih *glitch* & blur → masuk ke website utama.
- [ ] **Fase 3:** Halaman Publik 3D Editorial lengkap (Hero Z-Depth, 4 Layanan 3D Tilt, 3D Curved Portfolio Showcase, `/portfolio` + Lightbox, Pricelist Hybrid, Testimoni, Google Maps).
- [ ] **Fase 4:** Admin Panel / CMS (`/admin`) terhubung ke Supabase Auth, Database & Storage.
- [ ] **Fase 5:** Integrasi aset foto asli, optimasi akhir, & deployment ke Vercel.

---

## Cara Menjalankan di Lokal

```bash
# 1. Install dependensi
npm install

# 2. (Opsional) Salin .env.example menjadi .env lalu isi kredensial Supabase
#    Tanpa .env, website tetap berjalan menggunakan data fallback.
cp .env.example .env

# 3. Jalankan server development
npm run dev
```

Buka `http://localhost:5173/` di browser.

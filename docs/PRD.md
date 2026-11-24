# Product Requirements Document (PRD) — Efgraphy.id

**Versi:** 1.0  
**Tanggal:** 24 November 2026  
**Brand / Klien:** Efgraphy (`efgraphy.id`) — *"Memory of Lens"*  
**Owner:** Khoirul Fajri Rahman  
**Lokasi Base:** Jl. KH. Mukhsin, RT.02/RW.08, Tegolayang, Tegorejo, Kec. Pegandon, Kab. Kendal, Jawa Tengah 51357  
**Kontak WhatsApp Utama:** `0838-4308-1428` (`6283843081428`)  

---

## 1. Latar Belakang & Tujuan Produk

Efgraphy.id adalah penyedia jasa fotografi dan videografi (*All Event*) yang telah beroperasi sejak 2019 dengan basis di Kendal dan jangkauan layanan hingga Semarang, Batang, Pekalongan, dan sekitarnya.

Saat ini, seluruh portofolio tersebar di Instagram (`@efgraphy.id`) dan TikTok (`@efgraphy.id`) tanpa website resmi maupun katalog pricelist terpusat. Hal ini menimbulkan beberapa hambatan:
- Calon klien dari pencarian Google tidak bisa melihat portofolio secara bebas karena *login wall* Instagram.
- Calon klien dari TikTok harus berpindah ke Instagram terlebih dahulu sebelum mendapatkan kontak WhatsApp.
- Informasi jangkauan layanan luar kota (Semarang, Batang, Pekalongan) dan rincian layanan belum tersaji secara terstruktur.

### Tujuan Utama Website
1. **Meningkatkan Kepercayaan (*Brand Authority*):** Menghadirkan citra profesional, estetik, dan terpercaya dengan gaya *minimalis editorial*.
2. **Mempermudah Konversi ke WhatsApp:** Menghilangkan hambatan (*friction*) dengan tombol **Direct WhatsApp** yang membawa pesan otomatis sesuai layanan/paket yang diminati.
3. **Kemandirian Pengelolaan Konten:** Menyediakan **Admin Panel (CMS)** sederhana agar owner dapat mengunggah foto portofolio baru, memperbarui paket/harga, dan mengelola testimoni tanpa bantuan developer.

---

## 2. Target Pengguna (Personas)

| Persona | Karakteristik | Kebutuhan Utama di Website |
| :--- | :--- | :--- |
| **Calon Pengantin / Pasangan** | Usia 22–32 tahun, domisili Kendal, Semarang, Batang, Pekalongan; mencari fotografer wedding, prewedding, atau lamaran. | Melihat kualitas hasil foto/tone warna secara jernih, mengetahui kisaran harga, cek apakah melayani kotanya, dan langsung chat WA. |
| **Keluarga / Mahasiswa / Panitia Event** | Mencari dokumentasi birthday, picnic birthday, wisuda, tedhak siten, atau event kampus/instansi. | Menemukan layanan yang relevan, melihat testimoni (*kids friendly*, komunikatif), dan konsultasi gratis via WA. |
| **Owner / Admin Efgraphy** | Pemilik usaha (non-teknis / sibuk di lapangan). | Upload foto portofolio baru dari HP/laptop dengan cepat, ganti harga atau status paket, serta edit nomor WA/teks utama kapan saja. |

---

## 3. Ruang Lingkup Fitur (Scope MVP)

### A. Website Publik
1. **3D Camera Intro & Transisi Shutter ("Cekrek")**
   - Panggung awal interaktif menampilkan **kamera 3D** (React Three Fiber) lengkap dengan *viewfinder HUD* (`f/1.4 · 1/250s · ISO 100`).
   - Pengunjung dapat memutar/mengarahkan kamera dengan kursor lalu menekan **Capture / Masuk** (atau klik lensa) untuk memicu animasi zoom lensa, efek *shutter iris + flash* ("cekrek"), dan masuk mulus ke halaman utama. Tersedia tombol *Skip* dan penyimpanan sesi agar tidak mengganggu navigasi ulang.
2. **Hero Section Editorial (Z-Depth Weaving)**
   - Menampilkan identitas visual Efgraphy.id, tagline *"Memory of Lens"*, komposisi tipografi & foto berlapis Z-depth, ringkasan nilai jual (Kendal–Semarang & sekitarnya), serta 2 CTA utama: **Lihat Portofolio** dan **Konsultasi Gratis via WhatsApp**.
3. **Trust & Coverage Strip**
   - Menegaskan rekam jejak sejak **2019**, layanan **Free Konsultasi**, dan cakupan area (**Kendal · Semarang · Batang · Pekalongan**).
4. **4 Layanan Unggulan (*Featured Services*)**
   - **Wedding** (Akad/Ijab, Resepsi, Prepare)
   - **Prewedding** (Indoor & Outdoor)
   - **Engagement / Lamaran**
   - **Birthday / Wisuda** *(plus dukungan kategori tambahan untuk Event/Tedhak Siten/Anniversary)*
   - Setiap kartu layanan dilengkapi efek **3D Tilt interaktif**, preview visual, indikator harga (*"Mulai dari Rp..."* atau *"Request Pricelist"*), dan tombol langsung ke WhatsApp.
5. **Katalog Portofolio 3D Interaktif (`/portfolio` & 3D Showcase di Beranda)**
   - **Di Beranda:** **3D Curved Arc Showcase** yang bisa di-drag/klik dengan efek fokus tengah & depth-of-field serta indikator indeks (`01 / 08`).
   - **Di Halaman `/portfolio`:** Galeri filter kategori dengan kartu **3D Magnetic Tilt + Specular Sheen** dan **Lightbox Modal** layar penuh.
6. **Pricelist & Paket (Konsep Hybrid)**
   - **Mode 1 (`start_from`):** Menampilkan nominal awal `"Mulai dari Rp X.XXX.XXX"` beserta poin fasilitas utama.
   - **Mode 2 (`request_pricelist`):** Menampilkan label `"Request Pricelist"` untuk paket custom / fleksibel.
   - **Banner Request Pricelist Lengkap:** Bagian khusus dengan tombol langsung ke WhatsApp untuk meminta PDF/daftar harga lengkap seluruh layanan.
7. **Testimoni & Kolaborasi**
   - Menampilkan ulasan nyata klien (*social proof*) dan tombol menuju Google Maps Efgraphy.
8. **Lokasi, Kontak & Footer**
   - Alamat lengkap Pegandon Kendal, peta Google Maps, tautan Instagram & TikTok, tombol *Replay 3D Intro*, serta tombol **Floating WhatsApp** di seluruh halaman publik.

### B. Admin Panel / CMS (`/admin`)
1. **Autentikasi Admin (`/admin/login`)**
   - Login menggunakan email & password (Supabase Auth).
2. **Dashboard Ringkas**
   - Statistik jumlah foto portofolio, paket aktif, testimoni, serta tautan cepat ke halaman publik.
3. **Manajemen Portofolio (CRUD)**
   - Upload foto ke Supabase Storage, isi judul, pilih kategori, lokasi acara, dan toggle *Tampilkan di Beranda (Featured)*.
4. **Manajemen Paket & Pricelist (CRUD)**
   - Tambah/edit/hapus paket, pilih mode harga (`Mulai dari Rp...` atau `Request Pricelist`), kelola daftar fasilitas, tandai *Populer*, dan sesuaikan pesan WhatsApp otomatis.
5. **Manajemen Testimoni (CRUD)**
   - Tambah/edit/hapus nama klien, kategori acara, dan kutipan ulasan.
6. **Pengaturan Website (*Site Settings*)**
   - Edit nomor WhatsApp, pesan WA default, teks Hero, tautan media sosial, dan alamat.

---

## 4. Aturan Bisnis (*Business Rules*)

1. **Direct WhatsApp URL Format:**
   - Semua tombol pemesanan menggunakan format `https://wa.me/{whatsapp_number}?text={encoded_message}`.
   - Pesan otomatis dibedakan berdasarkan konteks tombol:
     - *Hero / Konsultasi:* `"Halo Efgraphy.id, saya ingin konsultasi gratis untuk dokumentasi foto/video."`
     - *Kartu Paket:* `"Halo Efgraphy.id, saya tertarik dengan paket {nama_paket}. Boleh info detail dan cek ketersediaan tanggal?"`
     - *Request Pricelist:* `"Halo Efgraphy.id, boleh minta pricelist lengkap untuk layanan foto & videonya?"`
2. **Mode Fallback Data:**
   - Jika kredensial Supabase belum diisi saat pengembangan lokal, website publik tetap dapat berjalan dengan data *seed/placeholder* agar tampilan dapat langsung ditinjau.
3. **Pengelolaan Foto Menyusul:**
   - Saat awal peluncuran/pengembangan, galeri menggunakan foto placeholder terkurasi yang dapat diganti langsung oleh owner melalui Admin Panel tanpa mengubah kode sumber.

---

## 5. Kriteria Penerimaan (*Acceptance Criteria*)

- [ ] Website tampil rapi, konsisten, dan mudah dinavigasi di layar Mobile (375px), Tablet (768px), dan Desktop (1280px+).
- [ ] Seluruh tombol WhatsApp membuka `wa.me` dengan nomor yang benar dan teks otomatis terisi rapi.
- [ ] Filter kategori portofolio dan Lightbox preview berjalan mulus tanpa reload halaman.
- [ ] Paket mendukung tampilan `"Mulai dari Rp..."` maupun `"Request Pricelist"` secara dinamis dari CMS.
- [ ] Halaman `/admin` tidak dapat diakses tanpa login; setelah login, owner dapat upload foto baru dan foto langsung muncul di website publik.
- [ ] Meta tags SEO, Open Graph, dan JSON-LD LocalBusiness terpasang di `index.html`.

---

## 6. Rencana Pengembangan Lanjutan (*Out of Scope untuk MVP / Phase 2*)

- Integrasi kalender ketersediaan tanggal (*Availability Calendar*).
- Pembayaran DP online (*Payment Gateway*).
- Galeri *Client Proofing* (link privat per klien untuk memilih foto yang akan dicetak/edit).
- Embed video Reels/TikTok langsung di galeri videografi.

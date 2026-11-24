# DESIGN.md — Efgraphy.id 3D Interactive Editorial Design System

Dokumen ini menjadi panduan tunggal (*single source of truth*) untuk arah visual, pengalaman 3D interaktif, tipografi, warna, layout, dan komponen antarmuka **Efgraphy.id ("Memory of Lens")** — memadukan estetika *minimalis editorial* (Putih–Hitam–Cream) dengan interaksi 3D sinematik terinspirasi dari *getlayers.ai*, *jiro.build* (`Velto`, `Indaco`, `Stillhaus`), dan showcase fotografi Three.js.

---

## 1. Filosofi Desain & Mode Permukaan

1. **Opening & Halaman Publik (`/` & `/portfolio`) — Mode *Experience + Persuade***
   - **Konsep Utama:** *"Entering Through the Lens"* — pengunjung tidak sekadar membuka website, melainkan masuk melalui pengalaman kamera 3D interaktif (*"cekrek"*) menuju galeri editorial berdimensi Z-depth.
   - **Aesthetic Direction:** *Minimalis Editorial 3D* (Putih–Hitam–Cream + aksen *dark viewfinder* pada intro kamera dan lightbox). Foto tetap menjadi bintang utama dengan ruang napas lega dan garis hairline `1px` yang presisi.
2. **Admin Panel (`/admin`) — Mode *Operate***
   - Tetap bersih, cepat dipindai, tanpa efek 3D berat agar owner fokus mengunggah foto dan mengelola paket.

---

## 2. Pengalaman 3D & Interaksi Utama (*Signature Moments*)

### A. 3D Camera Intro & Shutter "Cekrek" Transition
- **3D Centerpiece (React Three Fiber / Three.js):**
  - Model **kamera 3D prosedural** bergaya *modern-vintage rangefinder* (bodi matte charcoal `#181716`, dial & ring lensa *brushed champagne metal* `#C2A67E`, elemen kaca lensa reflektif, lampu indikator merah kecil).
  - Mengikuti pergerakan kursor secara halus (*physics inertia / lerp*) di desktop dan berotasi lembut (*idle float*) di mobile.
  - Dikelilingi elemen **Camera Viewfinder HUD** tipis di sudut layar: tanda kurung fokus `[ + ]`, indikator EXIF monospace (`f/1.4 · 1/250s · ISO 100 · EFGRAPHY.ID`), dan tombol pemicu **`CAPTURE / MASUK`**.
- **Animasi Transisi "Cekrek":**
  1. Saat pengunjung mengklik tombol *Capture* atau mengklik lensa kamera (tersedia juga tombol *Skip* kecil di pojok), kamera 3D melakukan *zoom-in* cepat ke arah lensa.
  2. **Shutter Iris Blade + White Flash** berdurasi ~0.35 detik menyala tajam disertai suara *shutter click* halus (dibangkitkan via Web Audio API saat dipicu klik user — tanpa perlu file audio eksternal).
  3. Layar terbuka mulus (*reveal*) menampilkan Hero Editorial Efgraphy.id.
  4. Status disimpan di `sessionStorage` agar saat berpindah halaman internal (misal dari `/portfolio` kembali ke `/`) intro tidak terus berulang kecuali pengunjung menekan tombol *"Replay Intro"* di footer.

### B. Hero Editorial dengan Z-Depth Typography Weaving *(inspirasi `getlayers.ai`)*
- Judul editorial serif berukuran besar (*"Memory of Lens"*) dikomposisikan berlapis secara Z-depth: kartu foto 3D berperspektif melayang **di belakang dan di depan** teks utama dengan *pointer parallax*.
- Bingkai **Circular Lens Reticle SVG** tipis di sekitar foto fokus + *viewfinder ruler tick marks* halus di tepi layar.

### C. Katalog Portofolio 3D Interaktif *(inspirasi `jiro.build`: Velto, Indaco, Stillhaus)*
Bukan sekadar kartu datar, katalog portofolio dilengkapi:
1. **3D Curved Arc / Perspective Carousel (di Beranda):**
   - Kartu foto tersusun melengkung dalam ruang 3D (`perspective` + `rotateY` + `translateZ`).
   - Foto di posisi tengah tajam dengan bingkai hairline, sementara foto di sisi kiri/kanan mengecil dan mengalami efek *depth-of-field* lembut layaknya bukaan lensa kamera.
   - Mendukung **Drag (geser mouse/sentuh), Klik, dan Navigasi Panah**, dilengkapi micro-status bar monospace: `DRAG · CLICK  01 / 08`.
2. **3D Magnetic Tilt Gallery + Lightbox (di `/portfolio`):**
   - Setiap kartu foto merespons posisi kursor dengan kemiringan 3D halus (`rotateX/Y`), efek pantulan cahaya lensa (*subtle specular sheen*), dan index nomor seri monospace (`001`, `002`, ...).
   - Klik foto membuka **Lightbox** berlatar gelap `#141312/95` dengan navigasi keyboard & gestur.

### D. Kartu Layanan & Pricelist Berdimensi
- 4 Layanan Utama (**Wedding, Prewedding, Engagement, Birthday/Wisuda**) menggunakan kartu berperspektif 3D tilt halus dengan rasio vertikal `3:4`, nomor indeks editorial, label harga hybrid (`Mulai dari Rp...` / `Request Pricelist`), dan tombol langsung ke WhatsApp.

---

## 3. Sistem Warna (*Color Tokens*)

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| `--bg-cream` | `#FAF8F5` | Latar belakang utama halaman publik (*warm editorial paper*) |
| `--bg-white` | `#FFFFFF` | Permukaan kartu, panel admin |
| `--bg-cream-alt` | `#F3EFE9` | Latar belakang section selang-seling |
| `--bg-obsidian` | `#121110` | Latar panggung **3D Camera Intro** & **Lightbox** agar pantulan 3D dan foto tampil dramatis |
| `--border-sand` | `#E6DFD5` | Garis hairline `1px` pada mode terang |
| `--border-dark` | `rgba(255,255,255,0.12)` | Garis hairline `1px` pada stage 3D gelap |
| `--ink-primary` | `#181716` | Teks utama, heading, tombol primer |
| `--ink-secondary` | `#5C5750` | Paragraf, deskripsi |
| `--ink-muted` | `#8C857B` | Caption, metadata |
| `--accent-champagne` | `#C2A67E` | Aksen logam kamera 3D, badge *Populer*, hover editorial |
| `--whatsapp` | `#1F6E43` | Tombol Direct WhatsApp yang elegan (hover `#185735`) |

---

## 4. Tipografi (*Typography Scale*)

- **Display / Heading:** `'Cormorant Garamond', Georgia, serif` (kombinasi regular & *italic* untuk nuansa majalah editorial).
- **UI & Body:** `'Plus Jakarta Sans', system-ui, sans-serif` (bersih, modern, `tabular-nums` untuk harga).
- **Micro-Telemetry / EXIF / Index:** `'JetBrains Mono', ui-monospace, monospace` (ukuran `11px–12px` uppercase untuk HUD kamera `f/1.4 · 1/250s`, nomor seri foto `01 / 12`, dan badge `[ MEMORY OF LENS ]`).

---

## 5. Disiplin Performa & Mobile-Safe 3D

Agar website tetap terasa *"wah"* namun tetap lancar 60fps di HP kelas menengah:
- **Canvas Lifecycle:** WebGL Canvas (kamera 3D) hanya aktif saat di intro/hero (di-unmount atau `frameloop="demand"` ketika sudah masuk ke halaman utama).
- **GPU-Only Animation:** Semua animasi scroll & 3D CSS hanya menganimasikan `transform` (`translate3d`, `rotateX/Y`, `scale`) dan `opacity`.
- **Adaptasi Mobile (`< 768px`):**
  - Efek 3D tilt berbasis kursor otomatis dinonaktifkan di perangkat sentuh.
  - 3D Curved Carousel beradaptasi menjadi *touch-swipe perspective carousel* yang mulus.
  - Kualitas DPR WebGL dibatasi `dpr={[1, 1.5]}` di mobile.
- **Aksesibilitas:** Mendukung `prefers-reduced-motion` (langsung melewati animasi berat dan menggunakan transisi fade halus), serta tombol `Skip Intro` selalu tersedia.

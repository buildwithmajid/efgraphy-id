/**
 * Data contoh (fallback) dipakai saat Supabase belum dihubungkan.
 * PENTING: harga & testimoni di bawah ini masih CONTOH/DUMMY —
 * ganti dengan data asli dari owner lewat Admin Panel setelah Supabase aktif.
 * Foto placeholder akan dibuat di Fase 3 (folder public/placeholders).
 */

export const fallbackSettings = {
  whatsapp_number: '6283843081428',
  hero_title: 'Memory of Lens',
  hero_subtitle:
    'Dokumentasi foto & video untuk wedding, prewedding, lamaran, hingga hari bahagia kecilmu di Kendal, Semarang, dan sekitarnya.',
  instagram_url: 'https://www.instagram.com/efgraphy.id/',
  tiktok_url: 'https://www.tiktok.com/@efgraphy.id',
  address: 'Jl. KH. Mukhsin, RT.02/RW.08, Tegolayang, Tegorejo, Kec. Pegandon, Kab. Kendal, Jawa Tengah 51357',
  maps_url: 'https://www.google.com/maps/place/Efgraphy/data=!4m2!3m1!1s0x0:0x68a9d494f7b3b812',
  service_area: 'Kendal · Semarang · Batang · Pekalongan',
  founded_year: '2019',
}

export const fallbackCategories = [
  { id: 'cat-wedding', name: 'Wedding', slug: 'wedding', sort_order: 1, description: 'Akad, resepsi, ngunduh mantu, dan momen persiapan sebelum ijab.' },
  { id: 'cat-prewedding', name: 'Prewedding', slug: 'prewedding', sort_order: 2, description: 'Sesi outdoor Kota Lama, Umbul Sidomukti, hingga Photo Studio.' },
  { id: 'cat-engagement', name: 'Engagement', slug: 'engagement', sort_order: 3, description: 'Lamaran & tunangan, hangat bersama dua keluarga.' },
  { id: 'cat-birthday', name: 'Birthday & Wisuda', slug: 'birthday-wisuda', sort_order: 4, description: 'Birthday party (termasuk EO), picnic birthday, dan wisuda.' },
  { id: 'cat-event', name: 'Tedhak Siten & Event', slug: 'event', sort_order: 5, description: 'Tedhak siten, photo studio, anniversary, serta event kampus & komunitas.' },
]

export const fallbackPortfolios = [
  { id: 'pf-1', category_id: 'cat-wedding', title: 'Ngunduh Mantu Susanto & Uswatun', location: 'Kendal', image_url: '/portfolio/wedding-1.jpg', is_featured: true, sort_order: 1 },
  { id: 'pf-2', category_id: 'cat-wedding', title: 'Bridal Preparation Nia & Fatkhurrohim', location: 'Kendal', image_url: '/portfolio/wedding-2.jpg', is_featured: true, sort_order: 2 },
  { id: 'pf-3', category_id: 'cat-prewedding', title: 'Prewedding Meirta & Aji', location: 'Kota Lama, Semarang', image_url: '/portfolio/prewedding-1.jpg', is_featured: true, sort_order: 3 },
  { id: 'pf-4', category_id: 'cat-prewedding', title: 'Outdoor Pine Forest Prewedding', location: 'Semarang · Kendal', image_url: '/portfolio/prewedding-2.jpg', is_featured: true, sort_order: 4 },
  { id: 'pf-5', category_id: 'cat-engagement', title: 'Engagement Day Anas & Zafira', location: 'Gringsing, Batang', image_url: '/portfolio/engagement-1.jpg', is_featured: true, sort_order: 5 },
  { id: 'pf-6', category_id: 'cat-birthday', title: 'Picnic Birthday Outdoor', location: 'Weleri, Kendal', image_url: '/portfolio/birthday-1.jpg', is_featured: true, sort_order: 6 },
  { id: 'pf-7', category_id: 'cat-birthday', title: 'Portrait Finalis Duta GenRe', location: 'Kendal', image_url: '/portfolio/studio-1.jpg', is_featured: true, sort_order: 7 },
  { id: 'pf-8', category_id: 'cat-event', title: 'Tedhak Siten Dek Ghea', location: 'Kendal', image_url: '/portfolio/tedhaksiten-1.jpg', is_featured: true, sort_order: 8 },
]

export const fallbackPackages = [
  {
    id: 'pk-wedding',
    category_id: 'cat-wedding',
    name: 'Wedding Akad & Resepsi',
    subtitle: 'Dokumentasi seharian penuh',
    price_mode: 'start_from',
    starting_price: 3500000, // CONTOH — ganti via Admin Panel
    features: ['Foto prepare, akad & resepsi', 'Album cetak eksklusif', 'Semua file edit via Google Drive', 'Opsi tambahan video highlight'],
    wa_message: null,
    is_popular: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'pk-prewedding',
    category_id: 'cat-prewedding',
    name: 'Prewedding Session',
    subtitle: 'Indoor studio atau outdoor',
    price_mode: 'start_from',
    starting_price: 1500000, // CONTOH — ganti via Admin Panel
    features: ['Sesi foto 3–4 jam', 'Konsultasi konsep & lokasi', 'File edit pilihan', 'Cetak foto besar + frame'],
    wa_message: null,
    is_popular: false,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'pk-engagement',
    category_id: 'cat-engagement',
    name: 'Lamaran / Engagement',
    subtitle: 'Momen dua keluarga',
    price_mode: 'start_from',
    starting_price: 1000000, // CONTOH — ganti via Admin Panel
    features: ['Dokumentasi acara lamaran', 'Foto keluarga & detail seserahan', 'Semua file edit'],
    wa_message: null,
    is_popular: false,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'pk-birthday',
    category_id: 'cat-birthday',
    name: 'Birthday & Wisuda',
    subtitle: 'Paket fleksibel sesuai acara',
    price_mode: 'request_pricelist',
    starting_price: null,
    features: ['Picnic / birthday party', 'Foto wisuda & keluarga', 'Durasi menyesuaikan acara'],
    wa_message: null,
    is_popular: false,
    is_active: true,
    sort_order: 4,
  },
]

export const fallbackTestimonials = [
  {
    id: 'ts-1',
    client_name: 'Indah (@indaharsm)',
    event_type: 'Wedding · Foto & Video',
    quote: 'New journey, forever adventure. Terima kasih buat tangan-tangan ajaibnya, Foto & Video by @efgraphy.id.',
    is_active: true,
  },
  {
    id: 'ts-2',
    client_name: 'Rania',
    event_type: 'Birthday Party',
    quote: 'Kids friendly pokoknya fotografernya, anak-anak nyaman banget difoto.',
    is_active: true,
  },
]

export const fallbackVideos = [
  {
    id: 'vid-1',
    category_id: 'cat-wedding',
    title: 'On Wedding Difa & Wahyu',
    video_url: 'https://www.instagram.com/efgraphy.id/reel/DYePzaXyy5P/',
    thumbnail_url: '/portfolio/wedding-1.jpg',
    aspect_ratio: 'vertical',
    duration: 'Reels',
    location: 'Kendal',
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'vid-2',
    category_id: 'cat-wedding',
    title: 'Bridal Preparation (In Preparation)',
    video_url: 'https://www.instagram.com/efgraphy.id/reel/DKeLVhCvT_p/',
    thumbnail_url: '/portfolio/wedding-2.jpg',
    aspect_ratio: 'vertical',
    duration: 'Reels',
    location: 'Kendal',
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'vid-3',
    category_id: 'cat-event',
    title: 'Tedhak Siten Cinematic Kayla Celine',
    video_url: 'https://www.instagram.com/efgraphy.id/reel/DDDvnVYTy9F/',
    thumbnail_url: '/portfolio/tedhaksiten-1.jpg',
    aspect_ratio: 'vertical',
    duration: 'Reels',
    location: 'Kendal',
    is_featured: true,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'vid-4',
    category_id: 'cat-wedding',
    title: 'Wedding Highlight Semarang Coverage',
    video_url: 'https://www.tiktok.com/@efgraphy.id/video/7651975546708004117',
    thumbnail_url: '/portfolio/prewedding-1.jpg',
    aspect_ratio: 'vertical',
    duration: 'TikTok',
    location: 'Semarang',
    is_featured: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'vid-5',
    category_id: 'cat-wedding',
    title: 'Photo After "Sah" (Wedding Akad)',
    video_url: 'https://www.instagram.com/efgraphy.id/reel/DVLFKPgk4Ha/',
    thumbnail_url: '/portfolio/engagement-1.jpg',
    aspect_ratio: 'vertical',
    duration: 'Reels',
    location: 'Kendal',
    is_featured: false,
    is_active: true,
    sort_order: 5,
  },
]

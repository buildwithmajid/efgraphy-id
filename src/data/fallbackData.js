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
    'Dokumentasi foto & video untuk wedding, prewedding, lamaran, hingga hari bahagia kecilmu — dari Kendal sampai Semarang.',
  instagram_url: 'https://www.instagram.com/efgraphy.id/',
  tiktok_url: 'https://www.tiktok.com/@efgraphy.id',
  address: 'Jl. KH. Mukhsin, RT.02/RW.08, Tegolayang, Tegorejo, Kec. Pegandon, Kab. Kendal, Jawa Tengah 51357',
  maps_url: 'https://www.google.com/maps/place/Efgraphy/data=!4m2!3m1!1s0x0:0x68a9d494f7b3b812',
  service_area: 'Kendal · Semarang · Batang · Pekalongan',
  founded_year: '2019',
}

export const fallbackCategories = [
  { id: 'cat-wedding', name: 'Wedding', slug: 'wedding', sort_order: 1, description: 'Akad, resepsi, dan momen persiapan sebelum ijab.' },
  { id: 'cat-prewedding', name: 'Prewedding', slug: 'prewedding', sort_order: 2, description: 'Sesi indoor studio maupun outdoor dengan cahaya sore.' },
  { id: 'cat-engagement', name: 'Engagement', slug: 'engagement', sort_order: 3, description: 'Lamaran & tunangan, hangat bersama dua keluarga.' },
  { id: 'cat-birthday', name: 'Birthday & Wisuda', slug: 'birthday-wisuda', sort_order: 4, description: 'Picnic birthday, ulang tahun anak, dan hari kelulusan.' },
  { id: 'cat-event', name: 'Event & Lainnya', slug: 'event', sort_order: 5, description: 'Tedhak siten, anniversary, acara kampus & komunitas.' },
]

export const fallbackPortfolios = [
  { id: 'pf-1', category_id: 'cat-wedding', title: 'Akad di Rumah Joglo', location: 'Kendal', image_url: '/placeholders/wedding-1.jpg', is_featured: true, sort_order: 1 },
  { id: 'pf-2', category_id: 'cat-wedding', title: 'Prepare Before Ijab', location: 'Pegandon, Kendal', image_url: '/placeholders/wedding-2.jpg', is_featured: true, sort_order: 2 },
  { id: 'pf-3', category_id: 'cat-prewedding', title: 'Golden Hour di Pantai', location: 'Kendal', image_url: '/placeholders/prewedding-1.jpg', is_featured: true, sort_order: 3 },
  { id: 'pf-4', category_id: 'cat-prewedding', title: 'Studio Monokrom', location: 'Semarang', image_url: '/placeholders/prewedding-2.jpg', is_featured: true, sort_order: 4 },
  { id: 'pf-5', category_id: 'cat-engagement', title: 'Lamaran Keluarga', location: 'Batang', image_url: '/placeholders/engagement-1.jpg', is_featured: true, sort_order: 5 },
  { id: 'pf-6', category_id: 'cat-birthday', title: 'Sunset Picnic Birthday', location: 'Kendal', image_url: '/placeholders/birthday-1.jpg', is_featured: true, sort_order: 6 },
  { id: 'pf-7', category_id: 'cat-birthday', title: 'Hari Wisuda', location: 'Semarang', image_url: '/placeholders/wisuda-1.jpg', is_featured: true, sort_order: 7 },
  { id: 'pf-8', category_id: 'cat-event', title: 'Tedhak Siten', location: 'Kendal', image_url: '/placeholders/event-1.jpg', is_featured: true, sort_order: 8 },
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
  { id: 'ts-1', client_name: 'Indah', event_type: 'Wedding', quote: 'Wedding dream pollll ♥️', is_active: true },
  { id: 'ts-2', client_name: 'Rania', event_type: 'Birthday', quote: 'Kids friendly pokoknya fotografernya, anak-anak nyaman difoto.', is_active: true },
]

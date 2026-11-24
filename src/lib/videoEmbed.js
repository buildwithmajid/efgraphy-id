/**
 * Mendeteksi sumber video untuk pemutar di dalam website:
 * - Direct MP4/WebM (lokal `/videos/...`, Supabase Storage, atau URL langsung) -> Native HTML5 player full-bleed (PALING MULUS)
 * - YouTube / YouTube Shorts / Google Drive -> Clean embed iframe tanpa kotak putih
 * - Instagram / TikTok -> Meta/TikTok memaksa kotak putih & redirect; tampilkan kartu cinema gelap + tombol tonton langsung
 */
export function parseVideoUrl(rawUrl = '') {
  const url = String(rawUrl || '').trim()
  if (!url) return { type: 'none', platform: 'Belum diisi', embedUrl: null, originalUrl: '' }

  // Direct MP4 / WebM / Blob / Data video (lokal atau Supabase Storage)
  if (
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
    url.startsWith('blob:') ||
    url.startsWith('data:video/')
  ) {
    return { type: 'video', platform: 'Video Player', embedUrl: url, originalUrl: url }
  }

  // YouTube & YouTube Shorts (bisa play langsung bersih tanpa kotak putih)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch) {
    return {
      type: 'iframe',
      platform: url.includes('/shorts/') ? 'YouTube Shorts' : 'YouTube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      originalUrl: url,
    }
  }

  // Google Drive preview
  const gdMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (gdMatch) {
    return {
      type: 'iframe',
      platform: 'Google Drive',
      embedUrl: `https://drive.google.com/file/d/${gdMatch[1]}/preview`,
      originalUrl: url,
    }
  }

  // Instagram & TikTok (hindari iframe putih bawaan IG yang memotong video & memunculkan scrollbar)
  if (url.includes('instagram.com')) {
    return { type: 'external', platform: 'Instagram Reels', embedUrl: null, originalUrl: url }
  }
  if (url.includes('tiktok.com')) {
    return { type: 'external', platform: 'TikTok', embedUrl: null, originalUrl: url }
  }

  return { type: 'external', platform: 'Tautan Video', embedUrl: null, originalUrl: url }
}

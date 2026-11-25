import { safeExternalUrl, safeMediaUrl } from './safeUrl'

/**
 * Mendeteksi sumber video untuk pemutar di dalam website dengan validasi protokol aman:
 * - Direct MP4/WebM (lokal `/videos/...`, Supabase Storage, atau URL https langsung) -> Native HTML5 player
 * - YouTube / YouTube Shorts / Google Drive -> Clean embed iframe
 * - Instagram / TikTok -> Kartu cinema gelap + tombol tonton langsung
 */
export function parseVideoUrl(rawUrl = '') {
  const url = String(rawUrl || '').trim()
  if (!url) return { type: 'none', platform: 'Belum diisi', embedUrl: null, originalUrl: '' }

  // Direct MP4 / WebM / Blob (lokal atau Supabase Storage)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:')) {
    const safeSrc = safeMediaUrl(url, '')
    if (!safeSrc) return { type: 'none', platform: 'URL Tidak Valid', embedUrl: null, originalUrl: '' }
    return { type: 'video', platform: 'Video Player', embedUrl: safeSrc, originalUrl: safeSrc }
  }

  // Pastikan tautan eksternal hanya menggunakan https:// atau http://
  const cleanUrl = safeExternalUrl(url, '')
  if (!cleanUrl) {
    return { type: 'none', platform: 'URL Tidak Valid', embedUrl: null, originalUrl: '' }
  }

  // YouTube & YouTube Shorts
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch) {
    return {
      type: 'iframe',
      platform: cleanUrl.includes('/shorts/') ? 'YouTube Shorts' : 'YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      originalUrl: cleanUrl,
    }
  }

  // Google Drive preview
  const gdMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (gdMatch) {
    return {
      type: 'iframe',
      platform: 'Google Drive',
      embedUrl: `https://drive.google.com/file/d/${gdMatch[1]}/preview`,
      originalUrl: cleanUrl,
    }
  }

  if (cleanUrl.includes('instagram.com')) {
    return { type: 'external', platform: 'Instagram Reels', embedUrl: null, originalUrl: cleanUrl }
  }
  if (cleanUrl.includes('tiktok.com')) {
    return { type: 'external', platform: 'TikTok', embedUrl: null, originalUrl: cleanUrl }
  }

  return { type: 'external', platform: 'Tautan Video', embedUrl: null, originalUrl: cleanUrl }
}

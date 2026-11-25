/**
 * Sanitasi protokol URL untuk mencegah injeksi skema berbahaya (misal javascript: atau data:text/html)
 * pada tautan eksternal maupun media yang berasal dari database.
 */

export function safeExternalUrl(raw, fallback = '#') {
  const value = String(raw || '').trim()
  if (!value) return fallback
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href
    }
    return fallback
  } catch {
    return fallback
  }
}

export function safeMediaUrl(raw, fallback = '') {
  const value = String(raw || '').trim()
  if (!value) return fallback
  // Izinkan path relatif lokal yang bersih (misal /portfolio/wedding-1.jpg)
  if (value.startsWith('/') && !value.startsWith('//')) return value
  // Izinkan blob/data image lokal (pratinjau upload)
  if (value.startsWith('blob:') || value.startsWith('data:image/')) return value
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href
    }
    return fallback
  } catch {
    return fallback
  }
}

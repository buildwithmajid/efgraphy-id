/**
 * Deteksi ringan perangkat berspesifikasi terbatas / mobile agar parameter GPU
 * (seperti DPR WebGL, resolusi bayangan, dan blur dinamis) otomatis menyesuaikan
 * tanpa menghilangkan fitur visual utama.
 */
let cachedLowEnd = null

export function isLowEndDevice() {
  if (cachedLowEnd !== null) return cachedLowEnd
  if (typeof window === 'undefined') return false

  const cores = navigator.hardwareConcurrency || 8
  const memory = navigator.deviceMemory || 8
  const saveData = Boolean(navigator.connection?.saveData)
  const isSmallScreen = window.innerWidth < 768

  cachedLowEnd = saveData || cores <= 4 || memory <= 4 || isSmallScreen
  return cachedLowEnd
}

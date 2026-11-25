const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_INPUT_IMAGE_BYTES = 15 * 1024 * 1024 // 15 MB sebelum kompresi

/**
 * Kompres & resize gambar di sisi klien sebelum upload ke Supabase Storage
 * agar foto DSLR/HP berukuran 5-15MB otomatis menjadi ringan (~150-350KB) dan tajam.
 * Hanya menerima format raster aman (JPG, PNG, WebP) untuk mencegah upload SVG/HTML.
 */
export function compressImage(file, { maxWidth = 1600, quality = 0.84 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
      reject(new Error('Format tidak diizinkan. Gunakan foto JPG, PNG, atau WebP.'))
      return
    }
    if (file.size > MAX_INPUT_IMAGE_BYTES) {
      reject(new Error('Ukuran file foto maksimal 15 MB sebelum kompresi.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Format gambar tidak didukung browser.'))
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal memproses kompresi gambar. Silakan coba foto lain.'))
              return
            }
            const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-') || 'foto'
            const outFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' })
            resolve(outFile)
          },
          'image/webp',
          quality,
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Gagal membuat pratinjau gambar.'))
    reader.readAsDataURL(file)
  })
}

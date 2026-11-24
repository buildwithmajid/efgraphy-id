/**
 * Helper Direct WhatsApp & format Rupiah.
 * Semua tombol pemesanan di website memakai fungsi di file ini.
 */

export const DEFAULT_WA_NUMBER = '6283843081428'

export const WA_MESSAGES = {
  consult: 'Halo Efgraphy.id, saya ingin konsultasi gratis untuk dokumentasi foto/video.',
  pricelist: 'Halo Efgraphy.id, boleh minta pricelist lengkap untuk layanan foto & videonya?',
  package: (name) =>
    `Halo Efgraphy.id, saya tertarik dengan paket ${name}. Boleh info detail dan cek ketersediaan tanggal?`,
  service: (name) =>
    `Halo Efgraphy.id, saya ingin tanya-tanya tentang layanan foto ${name}. Boleh info paket dan jadwalnya?`,
}

/** Normalisasi nomor: 0838... / +62 838... → 62838... */
export function normalizeWaNumber(raw = DEFAULT_WA_NUMBER) {
  const digits = String(raw).replace(/\D/g, '')
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('8')) return `62${digits}`
  return digits
}

export function buildWaLink(message = WA_MESSAGES.consult, number = DEFAULT_WA_NUMBER) {
  return `https://wa.me/${normalizeWaNumber(number)}?text=${encodeURIComponent(message)}`
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/** 1500000 → "Rp 1.500.000" */
export function formatRupiah(value) {
  if (value == null || Number.isNaN(Number(value))) return ''
  return rupiah.format(Number(value)).replace(/\u00a0/g, ' ')
}

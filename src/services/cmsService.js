/**
 * Layer akses data lengkap (Read + Admin CRUD + Storage Upload).
 * - Jika Supabase dikonfigurasi (.env terisi): seluruh operasi membaca/menulis ke Supabase PostgreSQL & Storage.
 * - Jika Supabase belum dikonfigurasi: berjalan dalam Mode Demo Lokal berbasis localStorage
 *   agar developer & owner bisa mencoba seluruh alur Admin CMS tanpa setup cloud terlebih dahulu.
 */
import { supabase, isSupabaseConfigured, PORTFOLIO_BUCKET } from '../lib/supabase'
import { compressImage, fileToDataUrl } from '../lib/imageCompress'
import {
  fallbackCategories,
  fallbackPackages,
  fallbackPortfolios,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallbackData'

const DEMO_KEYS = {
  portfolios: 'efg_demo_portfolios',
  packages: 'efg_demo_packages',
  testimonials: 'efg_demo_testimonials',
  settings: 'efg_demo_settings',
}

function readDemo(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeDemo(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('[cms] Gagal menyimpan demo localStorage:', err)
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

async function safeSelect(query, fallback) {
  if (!isSupabaseConfigured) return fallback
  const { data, error } = await query
  if (error) {
    console.warn('[cms] Gagal memuat data Supabase, memakai fallback:', error.message)
    return fallback
  }
  return data ?? fallback
}

// ============================================================
// PUBLIC READS
// ============================================================

export function getCategories() {
  return safeSelect(supabase?.from('categories').select('*').order('sort_order'), fallbackCategories)
}

export async function getPortfolios({ featuredOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.portfolios, fallbackPortfolios)
    return featuredOnly ? list.filter((p) => p.is_featured) : list
  }
  let q = supabase.from('portfolios').select('*').order('sort_order').order('created_at', { ascending: false })
  if (featuredOnly) q = q.eq('is_featured', true)
  const data = await safeSelect(q, fallbackPortfolios)
  return data.length ? data : fallbackPortfolios
}

export async function getPackages() {
  if (!isSupabaseConfigured) {
    return readDemo(DEMO_KEYS.packages, fallbackPackages).filter((p) => p.is_active)
  }
  const data = await safeSelect(
    supabase.from('packages').select('*').eq('is_active', true).order('sort_order'),
    fallbackPackages,
  )
  return data.length ? data : fallbackPackages
}

export async function getTestimonials() {
  if (!isSupabaseConfigured) {
    return readDemo(DEMO_KEYS.testimonials, fallbackTestimonials).filter((t) => t.is_active)
  }
  const data = await safeSelect(
    supabase.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    fallbackTestimonials,
  )
  return data.length ? data : fallbackTestimonials
}

export async function getSettings() {
  if (!isSupabaseConfigured) {
    return { ...fallbackSettings, ...readDemo(DEMO_KEYS.settings, {}) }
  }
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error || !data) return fallbackSettings
  return { ...fallbackSettings, ...Object.fromEntries(data.map((row) => [row.key, row.value])) }
}

// ============================================================
// ADMIN READS & CRUD — PORTFOLIOS
// ============================================================

export async function getAdminPortfolios() {
  if (!isSupabaseConfigured) {
    return readDemo(DEMO_KEYS.portfolios, fallbackPortfolios)
  }
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function uploadPortfolioImage(file) {
  const compressed = await compressImage(file)

  if (!isSupabaseConfigured) {
    return fileToDataUrl(compressed)
  }

  const filePath = `${Date.now()}-${compressed.name}`
  const { error: uploadError } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(filePath, compressed, { contentType: compressed.type, upsert: false })

  if (uploadError) throw new Error(`Gagal upload foto: ${uploadError.message}`)

  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

export async function createPortfolio(payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.portfolios, fallbackPortfolios)
    const item = { id: makeId('pf'), created_at: new Date().toISOString(), sort_order: 0, ...payload }
    writeDemo(DEMO_KEYS.portfolios, [item, ...list])
    return item
  }
  const { data, error } = await supabase.from('portfolios').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updatePortfolio(id, payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.portfolios, fallbackPortfolios)
    const next = list.map((item) => (item.id === id ? { ...item, ...payload } : item))
    writeDemo(DEMO_KEYS.portfolios, next)
    return next.find((item) => item.id === id)
  }
  const { data, error } = await supabase.from('portfolios').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deletePortfolio(id, imageUrl) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.portfolios, fallbackPortfolios)
    writeDemo(DEMO_KEYS.portfolios, list.filter((item) => item.id !== id))
    return
  }
  const { error } = await supabase.from('portfolios').delete().eq('id', id)
  if (error) throw new Error(error.message)

  // Hapus file di Supabase Storage jika berasal dari bucket portfolio-images
  if (imageUrl && imageUrl.includes(`/storage/v1/object/public/${PORTFOLIO_BUCKET}/`)) {
    const path = imageUrl.split(`/storage/v1/object/public/${PORTFOLIO_BUCKET}/`)[1]
    if (path) await supabase.storage.from(PORTFOLIO_BUCKET).remove([decodeURIComponent(path)])
  }
}

// ============================================================
// ADMIN READS & CRUD — PACKAGES
// ============================================================

export async function getAdminPackages() {
  if (!isSupabaseConfigured) {
    return readDemo(DEMO_KEYS.packages, fallbackPackages)
  }
  const { data, error } = await supabase.from('packages').select('*').order('sort_order').order('created_at')
  if (error) throw new Error(error.message)
  return data || []
}

export async function createPackage(payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.packages, fallbackPackages)
    const item = { id: makeId('pk'), created_at: new Date().toISOString(), ...payload }
    writeDemo(DEMO_KEYS.packages, [...list, item])
    return item
  }
  const { data, error } = await supabase.from('packages').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updatePackage(id, payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.packages, fallbackPackages)
    const next = list.map((item) => (item.id === id ? { ...item, ...payload } : item))
    writeDemo(DEMO_KEYS.packages, next)
    return next.find((item) => item.id === id)
  }
  const { data, error } = await supabase.from('packages').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deletePackage(id) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.packages, fallbackPackages)
    writeDemo(DEMO_KEYS.packages, list.filter((item) => item.id !== id))
    return
  }
  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ============================================================
// ADMIN READS & CRUD — TESTIMONIALS
// ============================================================

export async function getAdminTestimonials() {
  if (!isSupabaseConfigured) {
    return readDemo(DEMO_KEYS.testimonials, fallbackTestimonials)
  }
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function createTestimonial(payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.testimonials, fallbackTestimonials)
    const item = { id: makeId('ts'), created_at: new Date().toISOString(), ...payload }
    writeDemo(DEMO_KEYS.testimonials, [item, ...list])
    return item
  }
  const { data, error } = await supabase.from('testimonials').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateTestimonial(id, payload) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.testimonials, fallbackTestimonials)
    const next = list.map((item) => (item.id === id ? { ...item, ...payload } : item))
    writeDemo(DEMO_KEYS.testimonials, next)
    return next.find((item) => item.id === id)
  }
  const { data, error } = await supabase.from('testimonials').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteTestimonial(id) {
  if (!isSupabaseConfigured) {
    const list = readDemo(DEMO_KEYS.testimonials, fallbackTestimonials)
    writeDemo(DEMO_KEYS.testimonials, list.filter((item) => item.id !== id))
    return
  }
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ============================================================
// ADMIN SETTINGS
// ============================================================

export async function saveSettings(settingsObj) {
  if (!isSupabaseConfigured) {
    const current = readDemo(DEMO_KEYS.settings, {})
    writeDemo(DEMO_KEYS.settings, { ...current, ...settingsObj })
    return { ...fallbackSettings, ...current, ...settingsObj }
  }
  const rows = Object.entries(settingsObj).map(([key, value]) => ({
    key,
    value: value ?? '',
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)
  return settingsObj
}

export function resetDemoData() {
  Object.values(DEMO_KEYS).forEach((k) => localStorage.removeItem(k))
}

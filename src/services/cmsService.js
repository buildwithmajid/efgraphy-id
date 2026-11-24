/**
 * Layer akses data. Saat Supabase belum dikonfigurasi, semua fungsi baca
 * mengembalikan fallbackData sehingga website publik tetap tampil.
 * Fungsi tulis (CRUD admin) akan dilengkapi di Fase 4.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  fallbackCategories,
  fallbackPackages,
  fallbackPortfolios,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallbackData'

async function safeSelect(query, fallback) {
  if (!isSupabaseConfigured) return fallback
  const { data, error } = await query
  if (error) {
    console.warn('[cms] Gagal memuat data Supabase, memakai fallback:', error.message)
    return fallback
  }
  return data?.length ? data : fallback
}

export function getCategories() {
  return safeSelect(supabase?.from('categories').select('*').order('sort_order'), fallbackCategories)
}

export function getPortfolios({ featuredOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    return Promise.resolve(featuredOnly ? fallbackPortfolios.filter((p) => p.is_featured) : fallbackPortfolios)
  }
  let q = supabase.from('portfolios').select('*').order('sort_order').order('created_at', { ascending: false })
  if (featuredOnly) q = q.eq('is_featured', true)
  return safeSelect(q, fallbackPortfolios)
}

export function getPackages() {
  return safeSelect(
    supabase?.from('packages').select('*').eq('is_active', true).order('sort_order'),
    fallbackPackages,
  )
}

export function getTestimonials() {
  return safeSelect(
    supabase?.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    fallbackTestimonials,
  )
}

export async function getSettings() {
  if (!isSupabaseConfigured) return fallbackSettings
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error || !data) return fallbackSettings
  return { ...fallbackSettings, ...Object.fromEntries(data.map((row) => [row.key, row.value])) }
}

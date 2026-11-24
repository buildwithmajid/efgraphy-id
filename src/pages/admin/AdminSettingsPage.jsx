import { useEffect, useState } from 'react'
import { ExternalLink, Save } from 'lucide-react'
import { getSettings, saveSettings } from '../../services/cmsService'
import { buildWaLink, normalizeWaNumber, WA_MESSAGES } from '../../lib/whatsapp'

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    whatsapp_number: '',
    hero_title: '',
    hero_subtitle: '',
    service_area: '',
    founded_year: '',
    address: '',
    maps_url: '',
    instagram_url: '',
    tiktok_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings()
      .then((data) => setForm((prev) => ({ ...prev, ...data })))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      await saveSettings({
        ...form,
        whatsapp_number: normalizeWaNumber(form.whatsapp_number),
      })
      setFeedback('Pengaturan website berhasil disimpan.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-ink-2">Memuat pengaturan…</p>
  }

  const previewWa = buildWaLink(WA_MESSAGES.consult, form.whatsapp_number)

  return (
    <div className="space-y-6">
      <div className="border-b border-sand pb-6">
        <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Pengaturan Website</h1>
        <p className="mt-1 text-sm text-ink-2">
          Perbarui nomor WhatsApp booking, teks beranda, alamat studio, serta link media sosial Efgraphy.id.
        </p>
      </div>

      {feedback && (
        <div className="rounded-lg border border-wa/30 bg-wa/10 px-4 py-3 text-sm font-medium text-wa">
          {feedback}
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-sand bg-paper p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="st-wa" className="block text-xs font-medium text-ink">
              Nomor WhatsApp Booking *
            </label>
            <input
              id="st-wa"
              type="text"
              required
              value={form.whatsapp_number}
              onChange={handleChange('whatsapp_number')}
              placeholder="6283843081428"
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 font-mono text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
            <a
              href={previewWa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-wa hover:underline"
            >
              Uji link WA ({normalizeWaNumber(form.whatsapp_number)})
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div>
            <label htmlFor="st-year" className="block text-xs font-medium text-ink">
              Tahun Berdiri
            </label>
            <input
              id="st-year"
              type="text"
              value={form.founded_year}
              onChange={handleChange('founded_year')}
              placeholder="2019"
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="st-sub" className="block text-xs font-medium text-ink">
            Subjudul Hero Beranda
          </label>
          <textarea
            id="st-sub"
            rows={3}
            value={form.hero_subtitle}
            onChange={handleChange('hero_subtitle')}
            className="mt-1.5 block w-full rounded-lg border border-sand bg-cream/40 p-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="st-area" className="block text-xs font-medium text-ink">
              Area Jangkauan Layanan
            </label>
            <input
              id="st-area"
              type="text"
              value={form.service_area}
              onChange={handleChange('service_area')}
              placeholder="Kendal · Semarang · Batang · Pekalongan"
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="st-maps" className="block text-xs font-medium text-ink">
              URL Google Maps
            </label>
            <input
              id="st-maps"
              type="url"
              value={form.maps_url}
              onChange={handleChange('maps_url')}
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="st-addr" className="block text-xs font-medium text-ink">
            Alamat Base / Studio
          </label>
          <textarea
            id="st-addr"
            rows={2}
            value={form.address}
            onChange={handleChange('address')}
            className="mt-1.5 block w-full rounded-lg border border-sand bg-cream/40 p-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="st-ig" className="block text-xs font-medium text-ink">
              Link Instagram
            </label>
            <input
              id="st-ig"
              type="url"
              value={form.instagram_url}
              onChange={handleChange('instagram_url')}
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="st-tt" className="block text-xs font-medium text-ink">
              Link TikTok
            </label>
            <input
              id="st-tt"
              type="url"
              value={form.tiktok_url}
              onChange={handleChange('tiktok_url')}
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-sand pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-obsidian px-6 text-sm font-medium text-cream transition-colors hover:bg-wa disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}

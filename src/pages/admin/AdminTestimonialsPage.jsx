import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial,
} from '../../services/cmsService'

const EMPTY_FORM = {
  client_name: '',
  event_type: 'Wedding',
  quote: '',
  is_active: true,
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await getAdminTestimonials())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      client_name: item.client_name || '',
      event_type: item.event_type || '',
      quote: item.quote || '',
      is_active: item.is_active !== false,
    })
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const payload = {
        client_name: form.client_name.trim(),
        event_type: form.event_type.trim(),
        quote: form.quote.trim(),
        is_active: Boolean(form.is_active),
      }
      if (editingId) {
        await updateTestimonial(editingId, payload)
        setFeedback('Testimoni berhasil diperbarui.')
      } else {
        await createTestimonial(payload)
        setFeedback('Testimoni baru berhasil ditambahkan.')
      }
      setShowForm(false)
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus testimoni dari ${item.client_name}?`)) return
    try {
      await deleteTestimonial(item.id)
      setFeedback('Testimoni berhasil dihapus.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Kelola Testimoni</h1>
          <p className="mt-1 text-sm text-ink-2">
            Tampilkan ulasan nyata klien dari WhatsApp, Instagram, atau TikTok di halaman beranda.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-obsidian px-4 text-sm font-medium text-cream transition-colors hover:bg-wa"
        >
          <Plus className="size-4" />
          Tambah Testimoni
        </button>
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

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-sand bg-paper p-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="text-base font-semibold text-ink">
              {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Tutup form"
              className="grid size-8 place-items-center rounded-lg text-ink-2 hover:bg-cream-alt"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ts-name" className="block text-xs font-medium text-ink">
                Nama Klien *
              </label>
              <input
                id="ts-name"
                type="text"
                required
                value={form.client_name}
                onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                placeholder="Contoh: Indah & Dimas"
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="ts-type" className="block text-xs font-medium text-ink">
                Jenis Acara
              </label>
              <input
                id="ts-type"
                type="text"
                value={form.event_type}
                onChange={(e) => setForm((p) => ({ ...p, event_type: e.target.value }))}
                placeholder="Wedding / Prewedding / Lamaran / Birthday"
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="ts-quote" className="block text-xs font-medium text-ink">
              Isi Testimoni *
            </label>
            <textarea
              id="ts-quote"
              rows={3}
              required
              value={form.quote}
              onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
              placeholder="Tulis kutipan ulasan klien di sini…"
              className="mt-1.5 block w-full rounded-lg border border-sand bg-cream/40 p-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="size-4 accent-obsidian"
            />
            Tampilkan di halaman beranda
          </label>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-sand pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-10 rounded-lg border border-sand px-4 text-sm font-medium text-ink-2 hover:text-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-10 rounded-lg bg-obsidian px-5 text-sm font-medium text-cream transition-colors hover:bg-wa disabled:opacity-50"
            >
              {saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Simpan Testimoni'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-2">Memuat testimoni…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col justify-between rounded-lg border border-sand bg-paper p-5">
              <div>
                <p className="font-serif text-xl italic text-ink">“{item.quote}”</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-2">
                  <span className="font-semibold text-ink">{item.client_name}</span>
                  <span>
                    {item.event_type}
                    {!item.is_active ? ' · Nonaktif' : ''}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-sand pt-3">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand text-xs font-medium text-ink hover:border-ink"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sand px-3 text-danger hover:bg-danger/10"
                  aria-label={`Hapus testimoni ${item.client_name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

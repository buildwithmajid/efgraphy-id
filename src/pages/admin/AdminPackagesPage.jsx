import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  createPackage,
  deletePackage,
  getAdminPackages,
  getCategories,
  updatePackage,
} from '../../services/cmsService'
import { formatRupiah } from '../../lib/whatsapp'

const EMPTY_FORM = {
  name: '',
  subtitle: '',
  category_id: '',
  price_mode: 'start_from',
  starting_price: '',
  featuresText: '',
  wa_message: '',
  is_popular: false,
  is_active: true,
  sort_order: 1,
}

export default function AdminPackagesPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [pks, cats] = await Promise.all([getAdminPackages(), getCategories()])
      setItems(pks)
      setCategories(cats)
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
    setForm({
      ...EMPTY_FORM,
      category_id: categories[0]?.id || '',
      sort_order: items.length + 1,
    })
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  const openEdit = (pkg) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name || '',
      subtitle: pkg.subtitle || '',
      category_id: pkg.category_id || categories[0]?.id || '',
      price_mode: pkg.price_mode || 'request_pricelist',
      starting_price: pkg.starting_price ? String(pkg.starting_price) : '',
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      wa_message: pkg.wa_message || '',
      is_popular: Boolean(pkg.is_popular),
      is_active: pkg.is_active !== false,
      sort_order: pkg.sort_order ?? 1,
    })
    setError('')
    setFeedback('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const features = form.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      const payload = {
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),
        category_id: form.category_id || null,
        price_mode: form.price_mode,
        starting_price:
          form.price_mode === 'start_from' && form.starting_price
            ? Number(String(form.starting_price).replace(/\D/g, ''))
            : null,
        features,
        wa_message: form.wa_message.trim() || null,
        is_popular: Boolean(form.is_popular),
        is_active: Boolean(form.is_active),
        sort_order: Number(form.sort_order) || 0,
      }

      if (editingId) {
        await updatePackage(editingId, payload)
        setFeedback('Paket berhasil diperbarui.')
      } else {
        await createPackage(payload)
        setFeedback('Paket baru berhasil ditambahkan.')
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

  const handleDelete = async (pkg) => {
    if (!window.confirm(`Hapus paket "${pkg.name}"?`)) return
    try {
      await deletePackage(pkg.id)
      setFeedback('Paket berhasil dihapus.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Paket &amp; Pricelist</h1>
          <p className="mt-1 text-sm text-ink-2">
            Atur daftar paket yang tampil di website — bisa menampilkan harga awal atau langsung tanya pricelist via WA.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-obsidian px-4 text-sm font-medium text-cream transition-colors hover:bg-wa"
        >
          <Plus className="size-4" />
          Tambah Paket
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
              {editingId ? 'Edit Paket Layanan' : 'Tambah Paket Layanan Baru'}
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
              <label htmlFor="pk-name" className="block text-xs font-medium text-ink">
                Nama Paket *
              </label>
              <input
                id="pk-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Contoh: Wedding Akad & Resepsi"
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pk-sub" className="block text-xs font-medium text-ink">
                Subjudul Singkat
              </label>
              <input
                id="pk-sub"
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Contoh: Dokumentasi seharian penuh"
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pk-cat" className="block text-xs font-medium text-ink">
                Kategori Layanan
              </label>
              <select
                id="pk-cat"
                value={form.category_id}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pk-mode" className="block text-xs font-medium text-ink">
                Mode Tampilan Harga
              </label>
              <select
                id="pk-mode"
                value={form.price_mode}
                onChange={(e) => setForm((p) => ({ ...p, price_mode: e.target.value }))}
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
              >
                <option value="start_from">Mulai dari Rp ...</option>
                <option value="request_pricelist">Request Pricelist via WA</option>
              </select>
            </div>

            {form.price_mode === 'start_from' && (
              <div>
                <label htmlFor="pk-price" className="block text-xs font-medium text-ink">
                  Harga Awal (Rupiah, angka saja)
                </label>
                <input
                  id="pk-price"
                  type="number"
                  min="0"
                  step="50000"
                  value={form.starting_price}
                  onChange={(e) => setForm((p) => ({ ...p, starting_price: e.target.value }))}
                  placeholder="1500000"
                  className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink tabular-nums focus:border-ink focus:bg-paper focus:outline-none"
                />
                {form.starting_price && (
                  <p className="mt-1 text-xs text-ink-2">
                    Pratinjau: <strong>Mulai dari {formatRupiah(form.starting_price)}</strong>
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="pk-order" className="block text-xs font-medium text-ink">
                Urutan Tampil
              </label>
              <input
                id="pk-order"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink tabular-nums focus:border-ink focus:bg-paper focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="pk-features" className="block text-xs font-medium text-ink">
              Daftar Fasilitas Paket (1 baris = 1 poin)
            </label>
            <textarea
              id="pk-features"
              rows={4}
              value={form.featuresText}
              onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))}
              placeholder={'Foto akad & resepsi\nAlbum cetak eksklusif\nSemua file edit via Google Drive'}
              className="mt-1.5 block w-full rounded-lg border border-sand bg-cream/40 p-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="pk-wa" className="block text-xs font-medium text-ink">
              Template Pesan WhatsApp Khusus (Opsional)
            </label>
            <input
              id="pk-wa"
              type="text"
              value={form.wa_message}
              onChange={(e) => setForm((p) => ({ ...p, wa_message: e.target.value }))}
              placeholder="Kosongkan untuk memakai pesan otomatis sesuai nama paket"
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.is_popular}
                onChange={(e) => setForm((p) => ({ ...p, is_popular: e.target.checked }))}
                className="size-4 accent-obsidian"
              />
              Tandai sebagai Paket Populer (highlight gelap)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="size-4 accent-obsidian"
              />
              Aktif (tampil di website)
            </label>
          </div>

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
              {saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Simpan Paket'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-2">Memuat daftar paket…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((pkg) => (
            <article key={pkg.id} className="flex flex-col justify-between rounded-lg border border-sand bg-paper p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-ink">{pkg.name}</h3>
                    <p className="text-xs text-ink-2">
                      {categoryMap[pkg.category_id] || 'Umum'}
                      {pkg.subtitle ? ` · ${pkg.subtitle}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {pkg.is_popular && (
                      <span className="rounded-full bg-obsidian px-2.5 py-0.5 font-mono text-[10px] uppercase text-champagne">
                        Populer
                      </span>
                    )}
                    {!pkg.is_active && (
                      <span className="rounded-full bg-sand px-2.5 py-0.5 font-mono text-[10px] uppercase text-ink-2">
                        Nonaktif
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-lg font-semibold text-ink tabular-nums">
                  {pkg.price_mode === 'start_from' && pkg.starting_price
                    ? `Mulai dari ${formatRupiah(pkg.starting_price)}`
                    : 'Request Pricelist via WA'}
                </p>

                {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-ink-2">
                    {pkg.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-sand pt-3">
                <button
                  type="button"
                  onClick={() => openEdit(pkg)}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand text-xs font-medium text-ink hover:border-ink"
                >
                  <Pencil className="size-3.5" />
                  Edit Paket
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg)}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sand px-3 text-danger hover:bg-danger/10"
                  aria-label={`Hapus ${pkg.name}`}
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

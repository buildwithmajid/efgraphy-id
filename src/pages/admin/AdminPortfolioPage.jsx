import { useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Star, Trash2, Upload, X } from 'lucide-react'
import {
  createPortfolio,
  deletePortfolio,
  getAdminPortfolios,
  getCategories,
  updatePortfolio,
  uploadPortfolioImage,
} from '../../services/cmsService'

const EMPTY_FORM = {
  title: '',
  category_id: '',
  location: '',
  image_url: '',
  is_featured: true,
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const fileInputRef = useRef(null)

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [pf, cats] = await Promise.all([getAdminPortfolios(), getCategories()])
      setItems(pf)
      setCategories(cats)
      if (!form.category_id && cats[0]) {
        setForm((prev) => ({ ...prev, category_id: cats[0].id }))
      }
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
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' })
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      category_id: item.category_id || categories[0]?.id || '',
      location: item.location || '',
      image_url: item.image_url || '',
      is_featured: Boolean(item.is_featured),
    })
    setError('')
    setFeedback('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadPortfolioImage(file)
      setForm((prev) => ({ ...prev, image_url: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image_url.trim()) {
      setError('Unggah foto atau masukkan URL gambar terlebih dahulu.')
      return
    }
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const payload = {
        title: form.title.trim(),
        category_id: form.category_id || null,
        location: form.location.trim(),
        image_url: form.image_url.trim(),
        is_featured: Boolean(form.is_featured),
      }
      if (editingId) {
        await updatePortfolio(editingId, payload)
        setFeedback('Foto portofolio berhasil diperbarui.')
      } else {
        await createPortfolio(payload)
        setFeedback('Foto portofolio baru berhasil ditambahkan.')
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
    if (!window.confirm(`Hapus foto "${item.title}" dari portofolio?`)) return
    setError('')
    try {
      await deletePortfolio(item.id, item.image_url)
      setFeedback('Foto berhasil dihapus.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleFeatured = async (item) => {
    try {
      await updatePortfolio(item.id, { is_featured: !item.is_featured })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Kelola Portofolio</h1>
          <p className="mt-1 text-sm text-ink-2">
            Unggah karya terbaru Efgraphy.id. Foto bertanda bintang akan tampil di galeri utama halaman depan.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-obsidian px-4 text-sm font-medium text-cream transition-colors hover:bg-wa"
        >
          <Plus className="size-4" />
          Tambah Foto
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

      {/* Form Tambah / Edit */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-sand bg-paper p-6 shadow-[0_18px_40px_-28px_rgba(24,23,22,0.2)]"
        >
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="text-base font-semibold text-ink">
              {editingId ? 'Edit Foto Portofolio' : 'Unggah Foto Portofolio Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Tutup form"
              className="grid size-8 place-items-center rounded-lg text-ink-2 hover:bg-cream-alt hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-12">
            {/* Upload & Pratinjau */}
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-ink">Foto (Rasio 3:4 direkomendasikan)</label>
              <div className="mt-2 overflow-hidden rounded-lg border border-dashed border-sand bg-cream/60">
                {form.image_url ? (
                  <div className="relative aspect-[3/4] max-h-72 w-full bg-cream-alt">
                    <img src={form.image_url} alt="Pratinjau" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                      className="absolute right-2 top-2 rounded-full bg-obsidian/80 p-1.5 text-cream hover:bg-danger"
                      aria-label="Hapus pratinjau foto"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-12 text-center transition-colors hover:bg-cream-alt">
                    <Upload className="size-6 text-champagne-deep" />
                    <span className="mt-2 text-sm font-medium text-ink">
                      {uploading ? 'Mengompres & mengunggah…' : 'Pilih foto dari perangkat'}
                    </span>
                    <span className="mt-1 text-xs text-ink-3">JPG, PNG, WebP (otomatis dikompres agar ringan)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>

              <div className="mt-3">
                <label htmlFor="pf-url" className="block text-[11px] font-medium text-ink-2">
                  Atau tempel URL foto langsung
                </label>
                <input
                  id="pf-url"
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="/portfolio/wedding-1.jpg atau https://..."
                  className="mt-1 block min-h-10 w-full rounded-lg border border-sand bg-cream/40 px-3 text-xs text-ink focus:border-ink focus:bg-paper focus:outline-none"
                />
              </div>
            </div>

            {/* Detail Foto */}
            <div className="space-y-4 md:col-span-7">
              <div>
                <label htmlFor="pf-title" className="block text-xs font-medium text-ink">
                  Judul Foto *
                </label>
                <input
                  id="pf-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Contoh: Akad Adat Jawa di Pegandon"
                  className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pf-cat" className="block text-xs font-medium text-ink">
                    Kategori Layanan
                  </label>
                  <select
                    id="pf-cat"
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
                  <label htmlFor="pf-loc" className="block text-xs font-medium text-ink">
                    Lokasi Pemotretan
                  </label>
                  <input
                    id="pf-loc"
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Kendal / Semarang / Batang"
                    className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-sand bg-cream/40 p-3.5">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                  className="size-4 accent-obsidian"
                />
                <span className="text-sm text-ink">
                  <strong>Tampilkan di Beranda</strong>
                  <span className="block text-xs text-ink-2">Foto akan tampil di galeri pilihan halaman depan.</span>
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="min-h-10 rounded-lg border border-sand px-4 text-sm font-medium text-ink-2 hover:text-ink"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="min-h-10 rounded-lg bg-obsidian px-5 text-sm font-medium text-cream transition-colors hover:bg-wa disabled:opacity-50"
                >
                  {saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Simpan Foto'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Daftar Foto */}
      {loading ? (
        <p className="py-12 text-center text-sm text-ink-2">Memuat portofolio…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-sand bg-paper p-12 text-center">
          <p className="font-serif text-2xl text-ink">Belum ada foto portofolio</p>
          <p className="mt-1 text-sm text-ink-2">Klik tombol "Tambah Foto" di atas untuk mulai mengunggah.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-lg border border-sand bg-paper"
            >
              <div className="relative aspect-[3/4] bg-cream-alt">
                <img src={item.image_url} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => toggleFeatured(item)}
                  title={item.is_featured ? 'Tampil di Beranda' : 'Tampilkan di Beranda'}
                  className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm transition-colors ${
                    item.is_featured
                      ? 'bg-obsidian/85 text-champagne'
                      : 'bg-paper/85 text-ink-2 hover:text-ink'
                  }`}
                >
                  <Star className={`size-3 ${item.is_featured ? 'fill-champagne' : ''}`} />
                  {item.is_featured ? 'Beranda' : 'Galeri'}
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-2">
                    {categoryMap[item.category_id] || 'Tanpa Kategori'}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-sand pt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand text-xs font-medium text-ink transition-colors hover:border-ink"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-sand px-3 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
                    aria-label={`Hapus ${item.title}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

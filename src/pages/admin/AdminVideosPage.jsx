import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Film, Pencil, Plus, Star, Trash2, Upload, X } from 'lucide-react'
import {
  createVideo,
  deleteVideo,
  getAdminVideos,
  getCategories,
  updateVideo,
  uploadPortfolioImage,
  uploadPortfolioVideo,
} from '../../services/cmsService'
import { parseVideoUrl } from '../../lib/videoEmbed'
import { safeExternalUrl } from '../../lib/safeUrl'

const EMPTY_FORM = {
  title: '',
  category_id: '',
  video_url: '',
  thumbnail_url: '',
  aspect_ratio: 'vertical',
  duration: '',
  location: '',
  is_featured: true,
  is_active: true,
}

export default function AdminVideosPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const parsedPreview = useMemo(() => parseVideoUrl(form.video_url), [form.video_url])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [vids, cats] = await Promise.all([getAdminVideos(), getCategories()])
      setItems(vids)
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
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' })
    setError('')
    setFeedback('')
    setShowForm(true)
  }

  const openEdit = (video) => {
    setEditingId(video.id)
    setForm({
      title: video.title || '',
      category_id: video.category_id || categories[0]?.id || '',
      video_url: video.video_url || '',
      thumbnail_url: video.thumbnail_url || '',
      aspect_ratio: video.aspect_ratio || 'vertical',
      duration: video.duration || '',
      location: video.location || '',
      is_featured: Boolean(video.is_featured),
      is_active: video.is_active !== false,
    })
    setError('')
    setFeedback('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadPortfolioImage(file)
      setForm((prev) => ({ ...prev, thumbnail_url: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    setError('')
    try {
      const url = await uploadPortfolioVideo(file)
      setForm((prev) => ({ ...prev, video_url: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingVideo(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.thumbnail_url.trim()) {
      setError('Unggah foto cover thumbnail atau masukkan URL gambar terlebih dahulu.')
      return
    }
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const payload = {
        title: form.title.trim(),
        category_id: form.category_id || null,
        video_url: form.video_url.trim(),
        thumbnail_url: form.thumbnail_url.trim(),
        aspect_ratio: form.aspect_ratio,
        duration: form.duration.trim(),
        location: form.location.trim(),
        is_featured: Boolean(form.is_featured),
        is_active: Boolean(form.is_active),
      }
      if (editingId) {
        await updateVideo(editingId, payload)
        setFeedback('Video berhasil diperbarui.')
      } else {
        await createVideo(payload)
        setFeedback('Video baru berhasil ditambahkan.')
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

  const handleDelete = async (video) => {
    if (!window.confirm(`Hapus video "${video.title}"?`)) return
    try {
      await deleteVideo(video.id)
      setFeedback('Video berhasil dihapus.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleFeatured = async (video) => {
    try {
      await updateVideo(video.id, { is_featured: !video.is_featured })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink sm:text-4xl">Video &amp; Reels</h1>
          <p className="mt-1 text-sm text-ink-2">
            Upload klip MP4 pendek (maks. 25 MB) supaya langsung diputar di website, atau tempel link YouTube,
            Instagram Reels, dan TikTok.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-obsidian px-4 text-sm font-medium text-cream transition-colors hover:bg-wa"
        >
          <Plus className="size-4" />
          Tambah Video
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
              {editingId ? 'Edit Video / Reels' : 'Tambah Video / Reels Baru'}
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

          <div className="mt-5 grid gap-6 md:grid-cols-12">
            {/* Upload Thumbnail */}
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-ink">Cover Thumbnail Video *</label>
              <div className="mt-2 overflow-hidden rounded-lg border border-dashed border-sand bg-cream/60">
                {form.thumbnail_url ? (
                  <div className="relative aspect-[4/5] max-h-72 w-full bg-cream-alt">
                    <img src={form.thumbnail_url} alt="Pratinjau cover" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, thumbnail_url: '' }))}
                      className="absolute right-2 top-2 rounded-full bg-obsidian/80 p-1.5 text-cream hover:bg-danger"
                      aria-label="Hapus cover"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center px-4 py-12 text-center transition-colors hover:bg-cream-alt">
                    <Upload className="size-6 text-champagne-deep" />
                    <span className="mt-2 text-sm font-medium text-ink">
                      {uploading ? 'Mengunggah cover…' : 'Pilih gambar cover'}
                    </span>
                    <span className="mt-1 text-xs text-ink-3">JPG, PNG, WebP (otomatis dikompres)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleThumbUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>

              <div className="mt-3">
                <label htmlFor="vid-thumb-url" className="block text-[11px] font-medium text-ink-2">
                  Atau tempel URL cover
                </label>
                <input
                  id="vid-thumb-url"
                  type="text"
                  value={form.thumbnail_url}
                  onChange={(e) => setForm((p) => ({ ...p, thumbnail_url: e.target.value }))}
                  placeholder="/portfolio/wedding-2.jpg atau https://..."
                  className="mt-1 block min-h-10 w-full rounded-lg border border-sand bg-cream/40 px-3 text-xs text-ink focus:border-ink focus:bg-paper focus:outline-none"
                />
              </div>
            </div>

            {/* Metadata Video */}
            <div className="space-y-4 md:col-span-7">
              <div>
                <label htmlFor="vid-title" className="block text-xs font-medium text-ink">
                  Judul Video *
                </label>
                <input
                  id="vid-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Contoh: Wedding Highlight Kendal"
                  className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="vid-url" className="block text-xs font-medium text-ink">
                    Upload File MP4 (Play langsung full-screen) atau Tempel Link YouTube / Reels *
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-sand bg-cream px-2.5 py-1 text-[11px] font-medium text-ink transition-colors hover:border-ink">
                    <Upload className="size-3" />
                    {uploadingVideo ? 'Mengunggah MP4…' : 'Upload MP4 (≤25MB)'}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="sr-only"
                    />
                  </label>
                </div>
                <input
                  id="vid-url"
                  type="text"
                  required
                  value={form.video_url}
                  onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
                  placeholder="/videos/wedding-reel.mp4 atau link YouTube / Shorts"
                  className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                />
                {form.video_url && (
                  <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-2">
                    <Film className="size-3.5 text-champagne-deep" />
                    <span>
                      Terdeteksi: <strong>{parsedPreview.platform}</strong>{' '}
                      {parsedPreview.type === 'video'
                        ? '(diputar langsung full-bleed di website + preview hover!)'
                        : parsedPreview.type === 'iframe'
                          ? '(diputar langsung di pemutar website)'
                          : '(tampil kartu cinema + buka di aplikasi asli)'}
                    </span>
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="vid-cat" className="block text-xs font-medium text-ink">
                    Kategori
                  </label>
                  <select
                    id="vid-cat"
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
                  <label htmlFor="vid-ratio" className="block text-xs font-medium text-ink">
                    Orientasi Pemutar
                  </label>
                  <select
                    id="vid-ratio"
                    value={form.aspect_ratio}
                    onChange={(e) => setForm((p) => ({ ...p, aspect_ratio: e.target.value }))}
                    className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                  >
                    <option value="vertical">Vertikal 9:16 (Reels / TikTok / Shorts)</option>
                    <option value="landscape">Horizontal 16:9 (YouTube / Aftermovie)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="vid-dur" className="block text-xs font-medium text-ink">
                    Durasi Singkat
                  </label>
                  <input
                    id="vid-dur"
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="0:45"
                    className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 font-mono text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="vid-loc" className="block text-xs font-medium text-ink">
                    Lokasi
                  </label>
                  <input
                    id="vid-loc"
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Kendal / Semarang"
                    className="mt-1.5 block min-h-11 w-full rounded-lg border border-sand bg-cream/40 px-3.5 text-sm text-ink focus:border-ink focus:bg-paper focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                    className="size-4 accent-obsidian"
                  />
                  Tampilkan di Beranda (Motion &amp; Reels)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                    className="size-4 accent-obsidian"
                  />
                  Aktif
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-sand pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="min-h-10 rounded-lg border border-sand px-4 text-sm font-medium text-ink-2 hover:text-ink"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading || uploadingVideo}
                  className="min-h-10 rounded-lg bg-obsidian px-5 text-sm font-medium text-cream transition-colors hover:bg-wa disabled:opacity-50"
                >
                  {saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Simpan Video'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-2">Memuat daftar video…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-sand bg-paper p-12 text-center">
          <p className="font-serif text-2xl text-ink">Belum ada video &amp; Reels</p>
          <p className="mt-1 text-sm text-ink-2">Klik "Tambah Video" dan tempel link TikTok, Instagram Reels, atau YouTube.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((video) => {
            const parsed = parseVideoUrl(video.video_url)
            return (
              <article key={video.id} className="flex flex-col overflow-hidden rounded-lg border border-sand bg-paper">
                <div className="relative aspect-[4/5] bg-obsidian">
                  <img src={video.thumbnail_url} alt={video.title} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-obsidian/80 px-2.5 py-1 font-mono text-[10px] uppercase text-cream backdrop-blur-sm">
                    {parsed.platform}
                    {video.duration ? ` · ${video.duration}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(video)}
                    className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${
                      video.is_featured ? 'bg-obsidian/85 text-champagne' : 'bg-paper/85 text-ink-2'
                    }`}
                  >
                    <Star className={`size-3 ${video.is_featured ? 'fill-champagne' : ''}`} />
                    {video.is_featured ? 'Beranda' : 'Galeri'}
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="font-semibold text-ink">{video.title}</p>
                    <p className="mt-0.5 text-xs text-ink-2">
                      {categoryMap[video.category_id] || 'Videografi'}
                      {video.location ? ` · ${video.location}` : ''}
                    </p>
                    <a
                      href={safeExternalUrl(video.video_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-champagne-deep hover:underline"
                    >
                      Buka tautan asli
                      <ExternalLink className="size-3" />
                    </a>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-sand pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(video)}
                      className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand text-xs font-medium text-ink hover:border-ink"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(video)}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sand px-3 text-danger hover:bg-danger/10"
                      aria-label={`Hapus ${video.title}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

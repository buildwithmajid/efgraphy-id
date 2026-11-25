import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, MapPin, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'
import WhatsAppIcon from '../common/WhatsAppIcon'
import { buildWaLink } from '../../lib/whatsapp'
import { parseVideoUrl } from '../../lib/videoEmbed'
import { safeMediaUrl } from '../../lib/safeUrl'

function NativeVideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = ratio * v.duration
    setProgress(ratio * 100)
  }

  return (
    <div className="group relative h-full w-full cursor-pointer bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        playsInline
        aria-label={title}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (v.duration) setProgress((v.currentTime / v.duration) * 100)
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />

      {/* Indikator Pause di tengah saat dijeda */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-obsidian/30">
          <span className="grid size-16 place-items-center rounded-full border border-cream/40 bg-obsidian/70 text-cream backdrop-blur-sm">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </div>
      )}

      {/* Kontrol Cinema Minimalis Bawah */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 via-obsidian/45 to-transparent px-4 pb-3.5 pt-10"
      >
        <div
          role="slider"
          aria-label="Durasi video"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          tabIndex={0}
          onClick={handleSeek}
          className="mb-3 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-cream/25"
        >
          <div className="h-full rounded-full bg-champagne transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between text-cream">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Jeda video' : 'Putar video'}
            className="inline-flex size-9 items-center justify-center rounded-full bg-obsidian/60 text-cream transition-colors hover:bg-champagne hover:text-obsidian"
          >
            {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="inline-flex size-9 items-center justify-center rounded-full bg-obsidian/60 text-cream transition-colors hover:bg-champagne hover:text-obsidian"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VideoModal({ video, onClose, categoryMap, whatsappNumber }) {
  const isOpen = Boolean(video)
  const parsed = video ? parseVideoUrl(video.video_url) : null
  const isVertical = video?.aspect_ratio !== 'landscape'

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && video && parsed && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-obsidian/95 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pemutar video"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-cream/15 bg-obsidian/70 text-cream transition-colors hover:border-cream/50 sm:right-6 sm:top-6"
          >
            <X className="size-5" />
          </button>

          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`flex max-h-[92dvh] w-full flex-col items-center ${
              isVertical ? 'max-w-[380px]' : 'max-w-4xl'
            }`}
          >
            <div
              className={`relative w-full overflow-hidden rounded-sm border border-cream/15 bg-black shadow-[0_32px_90px_-24px_rgba(0,0,0,0.9)] ${
                isVertical ? 'aspect-[9/16] max-h-[74dvh]' : 'aspect-video max-h-[72dvh]'
              }`}
            >
              {parsed.type === 'video' ? (
                <NativeVideoPlayer src={parsed.embedUrl} poster={safeMediaUrl(video.thumbnail_url)} title={video.title} />
              ) : parsed.type === 'iframe' ? (
                <iframe
                  title={video.title}
                  src={parsed.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="relative flex h-full w-full flex-col items-center justify-center p-7 text-center">
                  <img
                    src={safeMediaUrl(video.thumbnail_url)}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/65 to-obsidian/45" />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="grid size-16 place-items-center rounded-full border border-champagne/60 bg-obsidian/80 text-champagne backdrop-blur-sm">
                      <Play className="ml-0.5 size-6 fill-champagne" />
                    </span>
                    <p className="mt-5 font-serif text-2xl font-medium text-cream">{video.title}</p>
                    <p className="mt-2 max-w-[30ch] text-xs leading-relaxed text-cream/75">
                      {parsed.platform} tidak mengizinkan pemutaran penuh tanpa bingkai di luar aplikasinya. Tonton
                      langsung di {parsed.platform} resmi Efgraphy.id.
                    </p>
                    {parsed.originalUrl && (
                      <a
                        href={parsed.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-champagne px-6 text-xs font-semibold text-obsidian transition-colors hover:bg-cream"
                      >
                        Tonton di {parsed.platform}
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 px-1 text-cream">
              <div>
                <p className="font-serif text-xl font-medium">{video.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2.5 text-xs text-cream/65">
                  <span className="font-mono uppercase tracking-[0.12em] text-champagne">
                    {categoryMap?.[video.category_id] || 'Videografi'}
                  </span>
                  {video.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {video.location}
                    </span>
                  )}
                </p>
              </div>

              <a
                href={buildWaLink(
                  `Halo Efgraphy.id, saya tertarik dengan video "${video.title}". Boleh info paket foto + videonya?`,
                  whatsappNumber,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-wa px-4 text-xs font-medium text-white transition-colors hover:bg-wa-hover"
              >
                <WhatsAppIcon className="size-3.5" />
                Tanya paket video via WA
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

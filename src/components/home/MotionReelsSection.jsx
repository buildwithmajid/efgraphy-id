import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin, Play } from 'lucide-react'
import TiltCard from '../common/TiltCard'
import { parseVideoUrl } from '../../lib/videoEmbed'

export default function MotionReelsSection({ videos, categoryMap, onSelectVideo }) {
  if (!videos?.length) return null

  return (
    <section className="border-t border-cream/10 bg-obsidian pb-20 pt-16 text-cream sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-[16ch] font-serif text-[clamp(2.1rem,4.8vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.015em] text-cream">
              Highlight <em className="font-normal text-champagne">video</em> &amp; Reels pilihan.
            </h2>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-cream/65">
              Wedding teaser, dokumentasi acara, hingga Reels vertikal siap tayang untuk Instagram dan TikTok.
            </p>
          </div>

          <Link
            to="/portfolio?tab=videos"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-cream/20 px-5 text-[13px] font-medium text-cream transition-colors hover:border-champagne hover:text-champagne md:self-auto"
          >
            Semua Video &amp; Reels
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {videos.slice(0, 3).map((video, idx) => {
            const parsed = parseVideoUrl(video.video_url)

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard
                  maxTilt={7}
                  scale={1.018}
                  onClick={() => onSelectVideo?.(video)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Putar video ${video.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectVideo?.(video)
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-sm border border-cream/15 bg-obsidian-soft transition-colors duration-300 hover:border-champagne/70"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {parsed.type === 'video' && (
                      <video
                        src={parsed.embedUrl}
                        muted
                        loop
                        playsInline
                        preload="none"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause()
                          e.currentTarget.currentTime = 0
                        }}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-obsidian/30"
                    />

                    {/* Metadata Atas: Platform & Durasi */}
                    <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-cream/85">
                      <span className="rounded-full border border-cream/20 bg-obsidian/65 px-2.5 py-1 backdrop-blur-sm">
                        {parsed.platform}
                      </span>
                      {video.duration && (
                        <span className="rounded-full bg-obsidian/65 px-2.5 py-1 tabular-nums backdrop-blur-sm">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Tombol Play Tengah */}
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="grid size-16 place-items-center rounded-full border border-cream/40 bg-obsidian/55 text-cream backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-champagne group-hover:bg-champagne group-hover:text-obsidian">
                        <Play className="ml-0.5 size-6 fill-current" />
                      </span>
                    </div>

                    {/* Judul & Lokasi Bawah */}
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-champagne">
                        {categoryMap?.[video.category_id] || 'Videografi'}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-medium leading-tight text-cream">
                        {video.title}
                      </h3>
                      {video.location && (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-cream/70">
                          <MapPin className="size-3" />
                          {video.location}
                        </p>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

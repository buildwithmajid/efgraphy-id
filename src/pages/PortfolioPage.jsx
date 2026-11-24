import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Expand, Film, MapPin, Play } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import FloatingWhatsApp from '../components/common/FloatingWhatsApp'
import TiltCard from '../components/common/TiltCard'
import LightboxModal from '../components/portfolio/LightboxModal'
import VideoModal from '../components/portfolio/VideoModal'
import WhatsAppIcon from '../components/common/WhatsAppIcon'
import { buildWaLink, WA_MESSAGES } from '../lib/whatsapp'
import { parseVideoUrl } from '../lib/videoEmbed'
import { getCategories, getPortfolios, getSettings, getVideos } from '../services/cmsService'
import {
  fallbackCategories,
  fallbackPortfolios,
  fallbackSettings,
  fallbackVideos,
} from '../data/fallbackData'

export default function PortfolioPage({ onReplayIntro }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'videos' ? 'videos' : 'all'

  const [settings, setSettings] = useState(fallbackSettings)
  const [categories, setCategories] = useState(fallbackCategories)
  const [portfolios, setPortfolios] = useState(fallbackPortfolios)
  const [videos, setVideos] = useState(fallbackVideos)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getSettings(), getCategories(), getPortfolios(), getVideos()]).then(([s, c, p, v]) => {
      setSettings(s)
      setCategories(c)
      setPortfolios(p)
      setVideos(v)
    })
  }, [])

  const selectTab = (tab) => {
    setActiveTab(tab)
    if (tab === 'videos') setSearchParams({ tab: 'videos' }, { replace: true })
    else setSearchParams({}, { replace: true })
  }

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const filteredPhotos = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'videos') return portfolios
    return portfolios.filter((p) => p.category_id === activeTab)
  }, [portfolios, activeTab])

  const isVideoTab = activeTab === 'videos'

  return (
    <div className="min-h-dvh overflow-x-clip bg-cream text-ink">
      <Navbar settings={settings} />

      <main className="mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="max-w-[14ch] font-serif text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-ink">
            Galeri <em className="font-normal text-ink-2">Portofolio</em>
          </h1>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink-2">
            Jelajahi dokumentasi foto maupun video Reels berdasarkan kategori acara. Klik karya untuk pratinjau penuh
            layar atau konsultasi konsep serupa via WhatsApp.
          </p>
        </div>

        {/* Filter Kategori Foto + Tab Video & Reels */}
        <div
          role="tablist"
          aria-label="Filter kategori portofolio"
          className="-mx-5 mt-10 flex flex-nowrap items-center gap-2 overflow-x-auto border-b border-sand px-5 pb-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => selectTab('all')}
            className={`relative min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors ${
              activeTab === 'all' ? 'text-cream' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {activeTab === 'all' && (
              <motion.span
                layoutId="portfolio-tab"
                className="absolute inset-0 -z-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">Semua Foto ({portfolios.length})</span>
          </button>

          {categories.map((cat) => {
            const selected = activeTab === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(cat.id)}
                className={`relative min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors ${
                  selected ? 'text-cream' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="portfolio-tab"
                    className="absolute inset-0 -z-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </button>
            )
          })}

          <button
            type="button"
            role="tab"
            aria-selected={isVideoTab}
            onClick={() => selectTab('videos')}
            className={`relative inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors ${
              isVideoTab ? 'text-cream' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {isVideoTab && (
              <motion.span
                layoutId="portfolio-tab"
                className="absolute inset-0 -z-0 rounded-full bg-obsidian"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <Film className="relative z-10 size-3.5" />
            <span className="relative z-10">Video &amp; Reels ({videos.length})</span>
          </button>
        </div>

        {/* Konten Tab: Video & Reels ATAU Grid Foto */}
        {isVideoTab ? (
          videos.length === 0 ? (
            <div className="mt-16 rounded-sm border border-sand bg-paper p-12 text-center">
              <p className="font-serif text-2xl text-ink">Belum ada video &amp; Reels ditambahkan.</p>
              <p className="mt-2 text-sm text-ink-2">
                Kunjungi TikTok atau Instagram @efgraphy.id untuk melihat koleksi video terbaru kami.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, idx) => {
                const parsed = parseVideoUrl(video.video_url)
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.25) }}
                  >
                    <TiltCard
                      maxTilt={7}
                      scale={1.015}
                      onClick={() => setActiveVideo(video)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveVideo(video)
                        }
                      }}
                      className="group cursor-pointer overflow-hidden rounded-sm border border-sand bg-obsidian text-cream transition-colors hover:border-champagne"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-obsidian/30" />
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
                          <span className="rounded-full bg-obsidian/70 px-2.5 py-1 backdrop-blur-sm">
                            {parsed.platform}
                          </span>
                          {video.duration && (
                            <span className="rounded-full bg-obsidian/70 px-2.5 py-1 tabular-nums backdrop-blur-sm">
                              {video.duration}
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="grid size-14 place-items-center rounded-full border border-cream/40 bg-obsidian/60 text-cream backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-champagne group-hover:bg-champagne group-hover:text-obsidian">
                            <Play className="ml-0.5 size-5 fill-current" />
                          </span>
                        </div>
                        <div className="absolute inset-x-4 bottom-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-champagne">
                            {categoryMap[video.category_id] || 'Videografi'}
                          </p>
                          <h2 className="mt-1 font-serif text-xl font-medium text-cream">{video.title}</h2>
                          {video.location && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-cream/70">
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
          )
        ) : filteredPhotos.length === 0 ? (
          <div className="mt-16 rounded-sm border border-sand bg-paper p-12 text-center">
            <p className="font-serif text-2xl text-ink">Belum ada foto di kategori ini.</p>
            <p className="mt-2 text-sm text-ink-2">
              Hubungi kami via WhatsApp untuk melihat contoh dokumentasi terbaru dari tim Efgraphy.id.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.25) }}
              >
                <TiltCard
                  maxTilt={7}
                  scale={1.015}
                  className="group cursor-pointer overflow-hidden rounded-sm border border-sand bg-paper transition-colors hover:border-champagne"
                  onClick={() => setLightboxIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setLightboxIndex(idx)
                    }
                  }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream-alt">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-obsidian/65 text-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Expand className="size-4" />
                    </span>
                    <span className="absolute left-3 top-3 rounded-full bg-obsidian/55 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-cream/90 backdrop-blur-sm">
                      {String(idx + 1).padStart(3, '0')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <h2 className="font-serif text-xl font-medium text-ink">{item.title}</h2>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                        <span className="font-mono uppercase tracking-[0.1em] text-champagne-deep">
                          {categoryMap[item.category_id] || 'Portofolio'}
                        </span>
                        {item.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" />
                            {item.location}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Bawah Galeri */}
        <div className="mt-20 rounded-sm border border-sand bg-obsidian p-8 text-center text-cream sm:p-12">
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">
            Punya konsep foto &amp; video impian untuk acaramu?
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed text-cream/70">
            Ceritakan tanggal, lokasi, dan suasana yang kamu bayangkan. Konsultasi gratis langsung bersama tim
            Efgraphy.id.
          </p>
          <a
            href={buildWaLink(WA_MESSAGES.consult, settings?.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-champagne px-7 text-sm font-medium text-obsidian transition-colors hover:bg-cream"
          >
            <WhatsAppIcon className="size-4" />
            Konsultasi via WhatsApp
          </a>
        </div>
      </main>

      <Footer settings={settings} onReplayIntro={onReplayIntro} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsapp_number} />

      <LightboxModal
        items={filteredPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
        categoryMap={categoryMap}
        whatsappNumber={settings?.whatsapp_number}
      />

      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        categoryMap={categoryMap}
        whatsappNumber={settings?.whatsapp_number}
      />
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import FloatingWhatsApp from '../components/common/FloatingWhatsApp'
import HeroSection from '../components/home/HeroSection'
import ServicesSection from '../components/home/ServicesSection'
import FilmstripDivider from '../components/home/FilmstripDivider'
import Portfolio3DShowcase from '../components/home/Portfolio3DShowcase'
import MotionReelsSection from '../components/home/MotionReelsSection'
import PricingSection from '../components/home/PricingSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import LocationSection from '../components/home/LocationSection'
import ClosingBanner from '../components/home/ClosingBanner'
import LightboxModal from '../components/portfolio/LightboxModal'
import VideoModal from '../components/portfolio/VideoModal'
import {
  getCategories,
  getPackages,
  getPortfolios,
  getSettings,
  getTestimonials,
  getVideos,
} from '../services/cmsService'
import {
  fallbackCategories,
  fallbackPackages,
  fallbackPortfolios,
  fallbackSettings,
  fallbackTestimonials,
  fallbackVideos,
} from '../data/fallbackData'

export default function HomePage({ revealed, onReplayIntro }) {
  const [settings, setSettings] = useState(fallbackSettings)
  const [categories, setCategories] = useState(fallbackCategories)
  const [portfolios, setPortfolios] = useState(fallbackPortfolios)
  const [videos, setVideos] = useState(fallbackVideos)
  const [packages, setPackages] = useState(fallbackPackages)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    Promise.all([
      getSettings(),
      getCategories(),
      getPortfolios({ featuredOnly: true }),
      getVideos({ featuredOnly: true }),
      getPackages(),
      getTestimonials(),
    ]).then(([s, c, p, v, pk, ts]) => {
      setSettings(s)
      setCategories(c)
      setPortfolios(p)
      setVideos(v)
      setPackages(pk)
      setTestimonials(ts)
    })
  }, [])

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  return (
    <div className="min-h-dvh overflow-x-clip bg-cream text-ink">
      <Navbar settings={settings} />

      <main>
        <HeroSection settings={settings} portfolios={portfolios} revealed={revealed} />
        <ServicesSection
          categories={categories}
          portfolios={portfolios}
          packages={packages}
          settings={settings}
        />
        <FilmstripDivider items={portfolios} onOpenLightbox={setLightboxIndex} />
        <Portfolio3DShowcase
          items={portfolios}
          categoryMap={categoryMap}
          onOpenLightbox={setLightboxIndex}
        />
        <MotionReelsSection
          videos={videos}
          categoryMap={categoryMap}
          onSelectVideo={setActiveVideo}
        />
        <PricingSection packages={packages} settings={settings} />
        <TestimonialsSection
          testimonials={testimonials}
          portfolios={portfolios}
          settings={settings}
        />
        <LocationSection settings={settings} />
        <ClosingBanner settings={settings} onReplayIntro={onReplayIntro} />
      </main>

      <Footer settings={settings} onReplayIntro={onReplayIntro} />
      <FloatingWhatsApp whatsappNumber={settings?.whatsapp_number} />

      <LightboxModal
        items={portfolios}
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

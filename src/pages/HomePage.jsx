import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import FloatingWhatsApp from '../components/common/FloatingWhatsApp'
import HeroSection from '../components/home/HeroSection'
import ServicesSection from '../components/home/ServicesSection'
import Portfolio3DShowcase from '../components/home/Portfolio3DShowcase'
import PricingSection from '../components/home/PricingSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import LocationSection from '../components/home/LocationSection'
import LightboxModal from '../components/portfolio/LightboxModal'
import {
  getCategories,
  getPackages,
  getPortfolios,
  getSettings,
  getTestimonials,
} from '../services/cmsService'
import {
  fallbackCategories,
  fallbackPackages,
  fallbackPortfolios,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallbackData'

export default function HomePage({ revealed, onReplayIntro }) {
  const [settings, setSettings] = useState(fallbackSettings)
  const [categories, setCategories] = useState(fallbackCategories)
  const [portfolios, setPortfolios] = useState(fallbackPortfolios)
  const [packages, setPackages] = useState(fallbackPackages)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    Promise.all([
      getSettings(),
      getCategories(),
      getPortfolios({ featuredOnly: true }),
      getPackages(),
      getTestimonials(),
    ]).then(([s, c, p, pk, ts]) => {
      setSettings(s)
      setCategories(c)
      setPortfolios(p)
      setPackages(pk)
      setTestimonials(ts)
    })
  }, [])

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <Navbar settings={settings} />

      <main>
        <HeroSection settings={settings} portfolios={portfolios} revealed={revealed} />
        <ServicesSection
          categories={categories}
          portfolios={portfolios}
          packages={packages}
          settings={settings}
        />
        <Portfolio3DShowcase
          items={portfolios}
          categoryMap={categoryMap}
          onOpenLightbox={setLightboxIndex}
        />
        <PricingSection packages={packages} settings={settings} />
        <TestimonialsSection testimonials={testimonials} settings={settings} />
        <LocationSection settings={settings} />
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
    </div>
  )
}

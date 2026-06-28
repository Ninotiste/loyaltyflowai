import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { LoyaltyBrain } from '@/components/landing/loyalty-brain'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { CtaFooter } from '@/components/landing/cta-footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05050A]">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <LoyaltyBrain />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CtaFooter />
    </div>
  )
}

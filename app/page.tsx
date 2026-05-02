import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BrandsCarousel } from "@/components/brands-carousel"
import { PartsFinder } from "@/components/parts-finder"
import { AboutSection } from "@/components/about-section"
import { Testimonials } from "@/components/testimonials"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BrandsCarousel />
      <PartsFinder />
      <AboutSection />
      <Testimonials />
      <ContactSection />
      <Footer />
    </main>
  )
}

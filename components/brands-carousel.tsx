"use client"

import { BRAND_LOGO_SVG, EU_UK_BRANDS } from "@/lib/eu-uk-vehicles"
import { SITE_COPY } from "@/lib/site-copy"

const carouselBrands = EU_UK_BRANDS.map((name) => {
  const logo = BRAND_LOGO_SVG[name]
  if (!logo) {
    throw new Error(`BRAND_LOGO_SVG is missing a logo URL for: ${name}`)
  }
  return { name, logo }
})

function PartnerLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex-shrink-0 mx-4 sm:mx-6 md:mx-10">
      <div className="flex items-center justify-center h-14 w-24 sm:h-16 sm:w-28 md:w-36">
        <img
          src={logo}
          alt={`${name} logo`}
          referrerPolicy="no-referrer"
          className="max-h-12 sm:max-h-14 max-w-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </div>
    </div>
  )
}

export function BrandsCarousel() {
  return (
    <section id="brands" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">
            Our Partners
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            All Partner Brands
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            {SITE_COPY.brandsCarouselIntro}
          </p>
        </div>

        {/* Infinite scrolling carousel - seamless loop */}
        <div className="relative overflow-hidden" dir="ltr">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 lg:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 lg:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Seamless infinite scroll wrapper */}
          <div className="brands-scroll-container">
            <div className="brands-scroll-track">
              {carouselBrands.map((brand, index) => (
                <PartnerLogo
                  key={`first-${brand.name}-${index}`}
                  name={brand.name}
                  logo={brand.logo}
                />
              ))}
              {carouselBrands.map((brand, index) => (
                <PartnerLogo
                  key={`second-${brand.name}-${index}`}
                  name={brand.name}
                  logo={brand.logo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

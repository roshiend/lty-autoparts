import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { EU_UK_BRANDS, PART_CATEGORIES } from "@/lib/eu-uk-vehicles"
import { SITE_COPY } from "@/lib/site-copy"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="font-bold text-xl">LTY.LTD</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              {SITE_COPY.footerBlurb}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>info@ltyway.co.uk</span>
              </div>
              <a
                href="https://wa.me/447353259996"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                <span className="tabular-nums">+44 7353 259996</span>
              </a>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                <span>Birmingham, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Brands we cover (same list as Parts Finder / search filters) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-semibold mb-4">Brands we cover</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {EU_UK_BRANDS.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/search?brand=${encodeURIComponent(brand)}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Part Categories */}
          <div>
            <h3 className="font-semibold mb-4">Part Categories</h3>
            <ul className="space-y-2">
              {PART_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/search?category=${encodeURIComponent(category)}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#parts-finder" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Parts Finder
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Request Quote
                </Link>
              </li>
              <li>
                <Link href="/#brands" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Our Brands
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Browse All Parts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} LTY.LTD All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useEffect, useState, type TransitionEvent } from "react"
import Link from "next/link"
import { Menu, X, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
/** UK mobile — international dial +44 (leading 0 dropped). */
const WHATSAPP_E164 = "447353259996"
const PHONE_DISPLAY_INTL = "+44 7353 259996"

const TOP_BAR_TAGLINES = [
  "Global Shipping",
  "OEM Quality",
  "Available 24/7",
] as const

/** Pause on each line before sliding to the next (ms). */
const TAGLINE_HOLD_MS = 2600
/** Quick slide duration (ms). */
const TAGLINE_SLIDE_MS = 320
const TAGLINE_ROW_PX = 28

/** One extra copy of the first line so we can slide seamlessly from last → first (like logo marquee). */
const TAGLINE_STRIP = [...TOP_BAR_TAGLINES, TOP_BAR_TAGLINES[0]]

const navigation = [
  { name: "Home", href: "/#" },
  { name: "Brands", href: "/#brands" },
  { name: "Parts Finder", href: "/#parts-finder" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
  { name: "Search", href: "/search" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [taglineIndex, setTaglineIndex] = useState(0)
  /** No CSS transition — used when snapping from duplicate first line back to real first (invisible reset). */
  const [taglineInstant, setTaglineInstant] = useState(false)

  /** Advance 0→1→2→3 with pause; index 3 shows duplicate “Global Shipping”. Reset handled on transition end. */
  useEffect(() => {
    if (taglineIndex >= TOP_BAR_TAGLINES.length) return

    const id = window.setTimeout(() => {
      setTaglineInstant(false)
      setTaglineIndex((prev) => prev + 1)
    }, TAGLINE_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [taglineIndex])

  const handleTaglineTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return
    if (taglineIndex !== TOP_BAR_TAGLINES.length) return

    setTaglineInstant(true)
    setTaglineIndex(0)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTaglineInstant(false))
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      {/* Top bar — stacks on small screens */}
      <div className="bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href={`https://wa.me/${WHATSAPP_E164}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-foreground/90 transition-colors min-h-10 sm:min-h-0"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                <span className="tabular-nums">{PHONE_DISPLAY_INTL}</span>
              </a>
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">info@ltyway.co.uk</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-center sm:text-right min-w-0 max-w-full sm:max-w-md shrink sm:ml-auto w-full sm:w-auto">
              <span className="sr-only">{TOP_BAR_TAGLINES.join(", ")}</span>
              <div
                className="overflow-hidden mx-auto sm:ml-auto sm:mr-0 motion-reduce:hidden max-w-[min(22rem,100%)]"
                style={{ height: TAGLINE_ROW_PX }}
                aria-hidden
              >
                <div
                  className="flex flex-col motion-reduce:!transition-none"
                  style={{
                    transform: `translateY(-${taglineIndex * TAGLINE_ROW_PX}px)`,
                    transition: taglineInstant
                      ? "none"
                      : `transform ${TAGLINE_SLIDE_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
                  }}
                  onTransitionEnd={handleTaglineTransitionEnd}
                >
                  {TAGLINE_STRIP.map((line, idx) => (
                    <span
                      key={`tagline-${idx}`}
                      className="flex shrink-0 items-center justify-center sm:justify-end whitespace-nowrap leading-none"
                      style={{ height: TAGLINE_ROW_PX }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              <p className="hidden motion-reduce:block whitespace-nowrap text-center sm:text-right">
                {TOP_BAR_TAGLINES.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl tracking-tight text-foreground">
                LTY.LTD
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/quote">
              <Button variant="outline" size="sm">
                Get Quote
              </Button>
            </Link>
            <Link href="/#parts-finder">
              <Button size="sm">
                Find Parts
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Quote
                  </Button>
                </Link>
                <Link href="/#parts-finder" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Find Parts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

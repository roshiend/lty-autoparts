"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Globe, Clock } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"
import { SITE_STATS } from "@/lib/site-stats"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 bg-primary text-primary-foreground overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70 mb-4">
              {SITE_COPY.heroEyebrow}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance">
              Used Vehicle
              <span className="block mt-2">Spare Parts</span>
              <span className="block mt-2 text-accent">Worldwide</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 text-pretty">
              {SITE_COPY.heroLead}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/#parts-finder">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Find Your Parts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Request a Quote
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-accent">
                  <Shield className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Quality Checked</span>
                </div>
                <p className="mt-1 text-sm text-primary-foreground/60">Tested & Graded</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-accent">
                  <Globe className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">50+ Countries</span>
                </div>
                <p className="mt-1 text-sm text-primary-foreground/60">Global Reach</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-accent">
                  <Clock className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Fast Shipping</span>
                </div>
                <p className="mt-1 text-sm text-primary-foreground/60">Express Delivery</p>
              </div>
            </div>

            {/* Stats — mobile / tablet (duplicated for small screens) */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              {SITE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-primary-foreground/20 text-center sm:text-left"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-accent tabular-nums">{stat.value}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats — desktop column */}
          <div className="hidden lg:grid grid-cols-2 gap-6">
            {SITE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20"
              >
                <p className="text-5xl font-bold text-accent tabular-nums">{stat.value}</p>
                <p className="mt-2 text-primary-foreground/80 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

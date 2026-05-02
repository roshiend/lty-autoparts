"use client"

import { Shield, Globe, Award, CheckCircle, Truck } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"
import { SITE_STATS } from "@/lib/site-stats"

const features = [
  {
    icon: Shield,
    title: "Quality Checked Used Parts",
    description: "All parts are inspected and graded before dispatch.",
  },
  {
    icon: Globe,
    title: "Global Shipping",
    description: "We regularly ship to buyers in 50+ countries with trusted logistics partners.",
  },
  {
    icon: Award,
    title: "Documented checks",
    description:
      "Repeatable inspection steps before dispatch — not a badge on the wall, but a process we apply to every order.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping options available for urgent orders.",
  },
]

/** Operational commitments we can stand behind — avoids implying third-party certs without certificate IDs on file. */
const QUALITY_STANDARDS = [
  "Pre-dispatch inspection — wear, damage, and basic function checked where practical",
  "Transparent grading so quoted condition matches what we ship",
  "Quotes matched to OEM references, VIN, reg, or photos when you provide them",
  "Export-ready packing and commercial paperwork for international shipments",
] as const

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">
              About Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Your Trusted Partner for
              <span className="text-accent block mt-1">Used Auto Parts</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {SITE_COPY.aboutLead}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {SITE_COPY.aboutSupporting}
            </p>

            {/* Process commitments — credible without naming regulators unless you hold formal certs */}
            <div className="mt-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-foreground mb-1">
                Our quality standards
              </h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-lg">
                We don&apos;t display regulator logos unless we can show certificate numbers on request. Below is what we
                actually do on every suitable order.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUALITY_STANDARDS.map((line) => (
                  <div key={line} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-snug">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-secondary rounded-xl border border-border hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar — same defensible figures as the hero (see @/lib/site-stats) */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_STATS.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-primary rounded-xl">
              <p className="text-4xl font-bold text-primary-foreground tabular-nums">{stat.value}</p>
              <p className="mt-2 text-sm text-primary-foreground/70 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Star, Quote } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

const testimonials = [
  {
    name: "Ahmed Al-Hassan",
    role: "Auto Parts Retailer",
    location: "Dubai, UAE",
    content: "LTY.LTD has been our trusted supplier for over 3 years. Their parts quality is exceptional, and the shipping is always on time. Highly recommended for any business looking for reliable German car parts.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Workshop Owner",
    location: "São Paulo, Brazil",
    content: "The parts finder tool saved us countless hours. We can quickly find exact OEM part numbers for Mercedes and BMW. Their customer service team is always helpful and responsive.",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Import Business Owner",
    location: "Accra, Ghana",
    content: "As a startup, we needed a supplier we could trust. LTY.LTD delivered beyond expectations. Fair prices, authentic parts, and professional documentation for customs.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Fleet Manager",
    location: "Mumbai, India",
    content: "Managing a fleet of European vehicles, we need consistent quality parts. LTY.LTD has never disappointed us. Range across our brands has been solid and delivery is reliable.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {SITE_COPY.testimonialsIntro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative p-6 sm:p-8 bg-card rounded-2xl border border-border hover:border-accent/50 transition-colors"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-accent font-semibold">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

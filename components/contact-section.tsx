"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { SITE_COPY } from "@/lib/site-copy"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again or use WhatsApp.")
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">
            Get in Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Contact Us
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {SITE_COPY.contactIntro}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg flex-shrink-0">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email Us</h3>
                  <p className="text-muted-foreground">info@ltyway.co.uk</p>
                </div>
              </div>

              <a
                href="https://wa.me/447353259996"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg flex-shrink-0">
                  <WhatsAppIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp</h3>
                  <p className="text-muted-foreground tabular-nums">+44 7353 259996</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Visit Us</h3>
                  <p className="text-muted-foreground">Unit 12, Autotech Business Park</p>
                  <p className="text-muted-foreground">Birmingham, UK B1 2ND</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Hours</h3>
                  <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Sat: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-2xl p-6 sm:p-8 border border-border">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Thank You for Contacting Us!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;ve received your message and aim to reply within 24–48 hours on business days.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="Tell us about your parts requirements, vehicle models, quantities needed, or any questions you have..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {submitting ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, CheckCircle, Plus, Trash2, Package, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getStoredCurrency,
  getSupportedCurrencies,
  guessCurrencyFromLocale,
  setStoredCurrency,
  type CurrencyCode,
} from "@/lib/currency"
import { EU_UK_BRANDS } from "@/lib/eu-uk-vehicles"
import { SITE_COPY } from "@/lib/site-copy"

/** Drop unsupported brands if old form state or pasted values still mention them. */
function sanitizeBrand(value: string): string {
  return EU_UK_BRANDS.includes(value) ? value : ""
}

interface PartRequest {
  id: number
  brand: string
  model: string
  year: string
  partName: string
  partNumber: string
  quantity: string
}

function QuoteFormContent() {
  const searchParams = useSearchParams()
  const prefilledPart = searchParams.get("part") || ""
  const prefilledName = searchParams.get("name") || ""

  const supportedCurrencies = useMemo(() => getSupportedCurrencies(), [])
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("GBP")

  useEffect(() => {
    const stored = getStoredCurrency()
    setSelectedCurrency(stored ?? guessCurrencyFromLocale())
  }, [])

  useEffect(() => {
    setStoredCurrency(selectedCurrency)
  }, [selectedCurrency])

  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    country: "",
    notes: "",
  })

  const [parts, setParts] = useState<PartRequest[]>([
    { id: 1, brand: "", model: "", year: "", partName: prefilledName, partNumber: prefilledPart, quantity: "1" }
  ])

  const addPart = () => {
    setParts([...parts, { id: Date.now(), brand: "", model: "", year: "", partName: "", partNumber: "", quantity: "1" }])
  }

  const removePart = (id: number) => {
    if (parts.length > 1) {
      setParts(parts.filter(p => p.id !== id))
    }
  }

  const updatePart = (id: number, field: keyof PartRequest, value: string) => {
    const next =
      field === "brand" ? sanitizeBrand(value) : value
    setParts(parts.map(p => p.id === id ? { ...p, [field]: next } : p))
  }

  useEffect(() => {
    setParts((prev) =>
      prev.some((p) => p.brand && !EU_UK_BRANDS.includes(p.brand))
        ? prev.map((p) =>
            p.brand && !EU_UK_BRANDS.includes(p.brand)
              ? { ...p, brand: "" }
              : p,
          )
        : prev,
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactInfo,
          parts,
          currencyPreference: selectedCurrency,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try WhatsApp or email.")
      }
      setReferenceId(`QR-${Date.now().toString().slice(-8)}`)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Request failed.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Quote Request Submitted!</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for your inquiry. Our team will review your request and send you a detailed quote within 24-48 business hours.
            </p>
            <div className="bg-secondary rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Reference Number: <span className="font-semibold text-foreground">{referenceId}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setReferenceId("")
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground">Request a Quote</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            {SITE_COPY.quoteIntro}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Currency preference:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
              className="h-9 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              {supportedCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          {/* Contact Information */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                <input
                  type="text"
                  value={contactInfo.company}
                  onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your Company Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+44 7353 259996"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                <input
                  type="text"
                  required
                  value={contactInfo.country}
                  onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="United Kingdom"
                />
              </div>
            </div>
          </div>

          {/* Parts Request */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Parts Required</h2>
              <Button type="button" variant="outline" size="sm" onClick={addPart} className="w-full sm:w-auto shrink-0">
                <Plus className="mr-1 h-4 w-4" />
                Add Part
              </Button>
            </div>

            <div className="space-y-6">
              {parts.map((part, index) => (
                <div key={part.id} className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-accent" />
                      <span className="font-medium text-foreground">Part {index + 1}</span>
                    </div>
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePart(part.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                      <select
                        value={part.brand}
                        onChange={(e) => updatePart(part.id, "brand", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                      >
                        <option value="">Select Brand</option>
                        {EU_UK_BRANDS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                      <input
                        type="text"
                        value={part.model}
                        onChange={(e) => updatePart(part.id, "model", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                        placeholder="e.g. C-Class"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                      <input
                        type="text"
                        value={part.year}
                        onChange={(e) => updatePart(part.id, "year", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                        placeholder="e.g. 2020"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Part Name / Description *</label>
                      <input
                        type="text"
                        required
                        value={part.partName}
                        onChange={(e) => updatePart(part.id, "partName", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                        placeholder="e.g. Front Brake Pads"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, "quantity", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-foreground mb-2">OEM Part Number (if known)</label>
                      <input
                        type="text"
                        value={part.partNumber}
                        onChange={(e) => updatePart(part.id, "partNumber", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                        placeholder="e.g. A0044206220"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Additional Notes</h2>
            <textarea
              rows={4}
              value={contactInfo.notes}
              onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Any additional information about your requirements, preferred shipping method, urgency, etc."
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
            {submitting ? "Sending…" : "Submit Quote Request"}
          </Button>
        </form>
      </div>
    </main>
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mb-8"></div>
            <div className="bg-card rounded-2xl border border-border p-8 h-96"></div>
          </div>
        </div>
      </main>
    }>
      <QuoteFormContent />
    </Suspense>
  )
}

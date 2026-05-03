"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Filter, Mail } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { useEffect, useMemo, useState, Suspense } from "react"
import {
  convertFromGbp,
  fetchGbpRates,
  formatMoney,
  getCachedGbpRates,
  getStoredCurrency,
  getSupportedCurrencies,
  guessCurrencyFromLocale,
  setCachedGbpRates,
  setStoredCurrency,
  type CurrencyCode,
} from "@/lib/currency"
import { EU_UK_BRANDS, MODELS_BY_BRAND, PART_CATEGORIES } from "@/lib/eu-uk-vehicles"
import { SITE_COPY } from "@/lib/site-copy"

type PartRow = {
  id: number
  name: string
  partNumber: string
  brand: string
  model: string
  category: string
  price: number
  inStock: boolean
  oem: boolean
}

/** Populate from your stock system when ready; empty means no online listings. */
const partsDatabase: PartRow[] = []

const WHATSAPP_NUMBER = "447353259996"

function SearchResultsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("GBP")
  const [gbpRates, setGbpRates] = useState<Record<string, number> | null>(null)

  const brandRaw = searchParams.get("brand") || ""
  const brand = EU_UK_BRANDS.includes(brandRaw) ? brandRaw : ""
  const model = searchParams.get("model") || ""
  const categoryRaw = searchParams.get("category") || ""
  const category = (PART_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? categoryRaw
    : ""
  const partNumber = searchParams.get("partNumber") || ""
  const oemOnly = searchParams.get("oem") === "1"
  const inStockOnly = searchParams.get("inStock") === "1"

  const patchSearchParams = (updates: Record<string, string | null>) => {
    const p = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") p.delete(key)
      else p.set(key, value)
    }
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const modelOptions = useMemo(() => {
    if (!brand) return []
    const fromMap = MODELS_BY_BRAND[brand] ?? []
    const fromDb = [
      ...new Set(partsDatabase.filter((p) => p.brand === brand).map((p) => p.model)),
    ]
    return [...new Set([...fromMap, ...fromDb])].sort((a, b) => a.localeCompare(b))
  }, [brand])

  useEffect(() => {
    if (brandRaw && !EU_UK_BRANDS.includes(brandRaw)) {
      const p = new URLSearchParams(searchParams.toString())
      p.delete("brand")
      const qs = p.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }, [brandRaw, pathname, router, searchParams])

  useEffect(() => {
    if (categoryRaw && !(PART_CATEGORIES as readonly string[]).includes(categoryRaw)) {
      const p = new URLSearchParams(searchParams.toString())
      p.delete("category")
      const qs = p.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }, [categoryRaw, pathname, router, searchParams])

  useEffect(() => {
    if (model && brand && modelOptions.length > 0 && !modelOptions.includes(model)) {
      const p = new URLSearchParams(searchParams.toString())
      p.delete("model")
      const qs = p.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }
  }, [brand, model, modelOptions, pathname, router, searchParams])

  const supportedCurrencies = useMemo(() => getSupportedCurrencies(), [])

  useEffect(() => {
    const stored = getStoredCurrency()
    setSelectedCurrency(stored ?? guessCurrencyFromLocale())
  }, [])

  useEffect(() => {
    setStoredCurrency(selectedCurrency)
  }, [selectedCurrency])

  useEffect(() => {
    const cached = getCachedGbpRates(12 * 60 * 60 * 1000) // 12h
    if (cached) {
      setGbpRates(cached)
      return
    }

    const controller = new AbortController()
    fetchGbpRates(controller.signal)
      .then((rates) => {
        setGbpRates(rates)
        setCachedGbpRates(rates)
      })
      .catch(() => {
        // Keep GBP-only display if rates fail.
        setGbpRates(null)
      })

    return () => controller.abort()
  }, [])

  // Filter parts based on search criteria
  const filteredParts = partsDatabase.filter((part) => {
    if (brand && part.brand !== brand) return false
    if (model && part.model !== model) return false
    if (category && part.category !== category) return false
    if (inStockOnly && !part.inStock) return false
    if (oemOnly && !part.oem) return false
    if (partNumber && !part.partNumber.toLowerCase().includes(partNumber.toLowerCase()) && !part.name.toLowerCase().includes(partNumber.toLowerCase())) return false
    return true
  })

  // Sort parts
  const sortedParts = [...filteredParts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const buildWhatsAppUrl = (part: { name: string; partNumber: string; brand: string; model: string }) => {
    const text = `Hi, I want to inquire about this part:\n\n${part.name}\nPart #: ${part.partNumber}\nVehicle: ${part.brand} ${part.model}`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button and title */}
        <div className="mb-8">
          <Link href="/#parts-finder" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Parts Finder
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Search Results</h1>
          <p className="text-muted-foreground mt-2">
            {sortedParts.length} parts found
            {brand && ` for ${brand}`}
            {model && ` ${model}`}
            {category && ` in ${category}`}
            {partNumber && ` matching "${partNumber}"`}
          </p>
          <p className="text-muted-foreground mt-3 text-sm max-w-2xl">
            {SITE_COPY.searchResultsNote}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl p-6 border border-border lg:sticky lg:top-36 lg:self-start">
              <h2 className="font-semibold text-foreground mb-1">Filters</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Vehicle brands: Europe &amp; UK only
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      const v = e.target.value
                      patchSearchParams({
                        brand: v || null,
                        model: null,
                      })
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                  >
                    <option value="">All brands</option>
                    {EU_UK_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Model</label>
                  <select
                    value={modelOptions.includes(model) ? model : ""}
                    disabled={!brand}
                    onChange={(e) => {
                      const v = e.target.value
                      patchSearchParams({ model: v || null })
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{brand ? "All models" : "Select a brand first"}</option>
                    {modelOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const v = e.target.value
                      patchSearchParams({ category: v || null })
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                  >
                    <option value="">All categories</option>
                    {PART_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={inStockOnly}
                        onChange={(e) =>
                          patchSearchParams({
                            inStock: e.target.checked ? "1" : null,
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground">In stock only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={oemOnly}
                        onChange={(e) =>
                          patchSearchParams({
                            oem: e.target.checked ? "1" : null,
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground">OEM parts only</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.replace(pathname)}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and filter controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:justify-end mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              
              <div className="flex flex-col gap-3 w-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2 sm:ml-auto sm:max-w-full">
                <span className="hidden lg:inline text-sm text-muted-foreground">Brand:</span>
                <select
                  value={brand}
                  onChange={(e) => {
                    const v = e.target.value
                    patchSearchParams({
                      brand: v || null,
                      model: null,
                    })
                  }}
                  className="h-10 sm:h-9 w-full sm:w-auto sm:max-w-[11rem] px-2 rounded-lg border border-input bg-background text-foreground text-sm"
                  aria-label="Filter by brand"
                >
                  <option value="">All</option>
                  {EU_UK_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <span className="hidden lg:inline text-sm text-muted-foreground">Model:</span>
                <select
                  value={modelOptions.includes(model) ? model : ""}
                  disabled={!brand}
                  onChange={(e) => {
                    const v = e.target.value
                    patchSearchParams({ model: v || null })
                  }}
                  className="h-10 sm:h-9 w-full sm:w-auto sm:max-w-[11rem] px-2 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Filter by model"
                >
                  <option value="">{brand ? "All" : "—"}</option>
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="hidden lg:inline text-sm text-muted-foreground">Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                  className="h-10 sm:h-9 w-full sm:w-auto px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                  aria-label="Display currency"
                >
                  {supportedCurrencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="hidden lg:inline text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 sm:h-9 w-full sm:w-auto px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                  aria-label="Sort results"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Parts Grid */}
            {sortedParts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedParts.map((part) => (
                  <div key={part.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {part.oem && (
                          <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded">OEM</span>
                        )}
                        {part.inStock ? (
                          <span className="text-xs font-medium bg-green-500/10 text-green-600 px-2 py-0.5 rounded">In Stock</span>
                        ) : (
                          <span className="text-xs font-medium bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">On Order</span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-1">{part.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Part #: {part.partNumber}</p>
                    <p className="text-sm text-muted-foreground mb-3">{part.brand} {part.model}</p>
                    
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border">
                      <div className="leading-tight">
                        {(() => {
                          const gbp = part.price
                          if (selectedCurrency === "GBP") {
                            return (
                              <p className="text-lg font-bold text-accent">
                                {formatMoney(gbp, "GBP")}
                              </p>
                            )
                          }

                          const converted = convertFromGbp(gbp, gbpRates, selectedCurrency)
                          if (converted == null) {
                            return (
                              <p className="text-lg font-bold text-accent">
                                {formatMoney(gbp, "GBP")}
                              </p>
                            )
                          }

                          return (
                            <>
                              <p className="text-lg font-bold text-accent">
                                {formatMoney(converted, selectedCurrency)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ≈ {formatMoney(gbp, "GBP")}
                              </p>
                            </>
                          )
                        })()}
                      </div>
                      <a href={buildWhatsAppUrl(part)} target="_blank" rel="noreferrer" className="sm:self-end">
                        <Button size="sm" className="w-full sm:w-auto">
                          <WhatsAppIcon className="mr-1 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No matching listings</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Online stock isn&apos;t listed here — tell us your vehicle and part number via quote or WhatsApp and we&apos;ll check availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/#parts-finder">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Modify Search
                    </Button>
                  </Link>
                  <Link href="/quote">
                    <Button>
                      Request Custom Quote
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-12 bg-primary rounded-xl p-6 text-primary-foreground">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Can&apos;t find what you&apos;re looking for?</h3>
                  <p className="text-primary-foreground/80">Contact our team for custom part sourcing.</p>
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <WhatsAppIcon className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href="mailto:info@ltyway.co.uk" className="w-full sm:w-auto">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Us
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}

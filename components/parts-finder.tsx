"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Car, Settings, Package } from "lucide-react"
import {
  EU_UK_BRANDS,
  MODELS_BY_BRAND,
  PART_CATEGORIES,
} from "@/lib/eu-uk-vehicles"
import { SITE_COPY } from "@/lib/site-copy"

const modelsByBrand = MODELS_BY_BRAND
const partCategories = [...PART_CATEGORIES]

export function PartsFinder() {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [partNumber, setPartNumber] = useState("")
  const [oemOnly, setOemOnly] = useState(false)

  const availableModels = selectedBrand ? modelsByBrand[selectedBrand] || [] : []

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set("brand", selectedBrand)
    if (selectedModel) params.set("model", selectedModel)
    if (selectedCategory) params.set("category", selectedCategory)
    if (partNumber.trim()) params.set("partNumber", partNumber.trim())
    if (oemOnly) params.set("oem", "1")
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section id="parts-finder" className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-accent mb-2">
            Quick Search
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Find Your Parts
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {SITE_COPY.partsFinderIntro}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Brand Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Car className="h-4 w-4 text-accent" />
                  Select Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSelectedModel("")
                  }}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Choose a brand</option>
                  {EU_UK_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Settings className="h-4 w-4 text-accent" />
                  Select Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a model</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Package className="h-4 w-4 text-accent" />
                  Part Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">All Categories</option>
                  {partCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* OEM Part Number Search */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Search className="h-4 w-4 text-accent" />
                  OEM Part Number
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="Enter OEM part number"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-input"
                  checked={oemOnly}
                  onChange={(e) => setOemOnly(e.target.checked)}
                />
                OEM parts only
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Parts
              </Button>
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedBrand("")
                  setSelectedModel("")
                  setSelectedCategory("")
                  setPartNumber("")
                  setOemOnly(false)
                }}
              >
                Clear Search
              </Button>
            </div>
          </form>
        </div>

        {/* Popular used-part categories (same taxonomy as inventory — all used) */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
            Popular Used Part Categories
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-xl mx-auto">
            Shortcuts to browse used parts by type — all items in these categories are used.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {partCategories.slice(0, 5).map((category) => (
              <button
                key={category}
                type="button"
                aria-label={`Browse used ${category}`}
                onClick={() => {
                  setSelectedCategory(category)
                  router.push(`/search?category=${encodeURIComponent(category)}`)
                }}
                className="p-4 bg-card rounded-xl border border-border hover:border-accent hover:shadow-md transition-all text-center group"
              >
                <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
                <p className="text-sm font-medium text-foreground">{category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

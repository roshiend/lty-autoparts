import { EU_UK_BRANDS } from "@/lib/eu-uk-vehicles"

export type SiteStat = { value: string; label: string }

/**
 * Homepage / About metrics — avoid unverifiable inventory or customer counts.
 * Marque figure tracks {@link EU_UK_BRANDS} so it stays accurate if brands change.
 */
export const SITE_STATS: SiteStat[] = [
  { value: "15+", label: "Years in used parts" },
  { value: `${EU_UK_BRANDS.length}+`, label: "EU & UK marques" },
  { value: "50+", label: "Countries shipped" },
  { value: "24–48h", label: "Typical quote reply" },
]

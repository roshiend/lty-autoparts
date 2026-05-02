export type CurrencyCode =
  | "GBP"
  | "LKR"
  | "INR"
  | "PKR"
  | "BDT"
  | "AED"
  | "SAR"
  | "QAR"
  | "KWD"
  | "BHD"
  | "OMR"
  | "SGD"
  | "MYR"
  | "THB"
  | "IDR"
  | "PHP"

type RatesResponse = {
  rates: Record<string, number>
  time_last_update_unix?: number
}

const LS_SELECTED = "apg.currency.selected"
const LS_RATES = "apg.currency.rates.gbp"
const LS_RATES_AT = "apg.currency.rates.gbp.at"

const SUPPORTED: CurrencyCode[] = [
  "GBP",
  "LKR",
  "INR",
  "PKR",
  "BDT",
  "AED",
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "SGD",
  "MYR",
  "THB",
  "IDR",
  "PHP",
]

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  GB: "GBP",
  LK: "LKR",
  IN: "INR",
  PK: "PKR",
  BD: "BDT",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  SG: "SGD",
  MY: "MYR",
  TH: "THB",
  ID: "IDR",
  PH: "PHP",
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function normalizeCurrency(code: string | null | undefined): CurrencyCode | null {
  if (!code) return null
  const upper = code.toUpperCase()
  return (SUPPORTED as string[]).includes(upper) ? (upper as CurrencyCode) : null
}

export function getSupportedCurrencies(): CurrencyCode[] {
  return [...SUPPORTED]
}

export function getStoredCurrency(): CurrencyCode | null {
  if (typeof window === "undefined") return null
  return normalizeCurrency(window.localStorage.getItem(LS_SELECTED))
}

export function setStoredCurrency(code: CurrencyCode | null) {
  if (typeof window === "undefined") return
  if (!code) {
    window.localStorage.removeItem(LS_SELECTED)
    return
  }
  window.localStorage.setItem(LS_SELECTED, code)
}

export function guessCurrencyFromLocale(): CurrencyCode {
  if (typeof window === "undefined") return "GBP"
  const locale = navigator.language || ""
  const m = locale.match(/-([A-Za-z]{2})$/)
  const region = m?.[1]?.toUpperCase()
  if (region && COUNTRY_TO_CURRENCY[region]) return COUNTRY_TO_CURRENCY[region]
  return "GBP"
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  // Keep display friendly (LKR etc often shown without decimals).
  const zeroDecimal = new Set<CurrencyCode>(["LKR", "IDR"])
  const minimumFractionDigits = zeroDecimal.has(currency) ? 0 : 2
  const maximumFractionDigits = zeroDecimal.has(currency) ? 0 : 2

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export function convertFromGbp(gbp: number, rates: Record<string, number> | null, to: CurrencyCode): number | null {
  if (to === "GBP") return gbp
  const r = rates?.[to]
  if (!r || !Number.isFinite(r)) return null
  return gbp * r
}

export function getCachedGbpRates(maxAgeMs: number): Record<string, number> | null {
  if (typeof window === "undefined") return null
  const at = Number(window.localStorage.getItem(LS_RATES_AT) || 0)
  if (!at || Date.now() - at > maxAgeMs) return null
  return safeJsonParse<Record<string, number>>(window.localStorage.getItem(LS_RATES))
}

export function setCachedGbpRates(rates: Record<string, number>) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LS_RATES, JSON.stringify(rates))
  window.localStorage.setItem(LS_RATES_AT, String(Date.now()))
}

export async function fetchGbpRates(signal?: AbortSignal): Promise<Record<string, number>> {
  // Free, simple endpoint returning base=GBP with rates map.
  // If this ever changes, we’ll still fall back to GBP display.
  const res = await fetch("https://open.er-api.com/v6/latest/GBP", { signal })
  if (!res.ok) throw new Error(`rates_fetch_failed_${res.status}`)
  const json = (await res.json()) as RatesResponse
  if (!json?.rates) throw new Error("rates_missing")
  return json.rates
}


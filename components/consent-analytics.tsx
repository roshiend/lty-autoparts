"use client"

import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"
import { getStoredConsent } from "@/components/cookie-consent"

/** Loads Vercel Analytics only after user accepts analytics cookies (production). */
export function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => {
      setEnabled(getStoredConsent() === "analytics")
    }
    sync()
    window.addEventListener("cookie-consent-updated", sync)
    return () => window.removeEventListener("cookie-consent-updated", sync)
  }, [])

  if (process.env.NODE_ENV !== "production") return null
  if (!enabled) return null

  return <Analytics />
}

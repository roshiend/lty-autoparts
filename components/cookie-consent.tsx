"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "lty.cookie-consent"

export type CookieConsentValue = "essential" | "analytics"

export function getStoredConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === "essential" || v === "analytics") return v
  } catch {
    /* ignore */
  }
  return null
}

export function setConsent(value: CookieConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("cookie-consent-updated"))
}

/** Bottom banner — Accept analytics (Vercel Analytics) or essential-only. */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getStoredConsent() === null)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-card/95 backdrop-blur-md shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground max-w-3xl">
          We use essential cookies to run the site. With your permission we also use analytics to understand traffic
          (see our{" "}
          <Link href="/cookies" className="text-accent underline underline-offset-2">
            Cookie Policy
          </Link>
          ).
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setConsent("essential")
              setVisible(false)
            }}
          >
            Essential only
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setConsent("analytics")
              setVisible(false)
            }}
          >
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Canonical public origin for SEO (sitemap, robots, Open Graph).
 *
 * Prefer `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.example.com).
 * On Cloudflare Pages, `CF_PAGES_URL` is set automatically for preview/production URLs.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")

  const cfPages = process.env.CF_PAGES_URL?.trim()
  if (cfPages) return cfPages.replace(/\/$/, "")

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")
    return `https://${host}`
  }

  return "http://localhost:3000"
}

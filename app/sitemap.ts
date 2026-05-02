import type { MetadataRoute } from "next"

function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  )
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl()
  const paths = ["", "/search", "/quote", "/privacy", "/terms", "/cookies"]

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }))
}

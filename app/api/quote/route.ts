import { NextResponse } from "next/server"
import { quotePayloadSchema } from "@/lib/api-schemas"
import { sendTransactionalEmail } from "@/lib/email"
import { escapeHtml } from "@/lib/escape-html"

const MAX_BODY_BYTES = 96_000

export async function POST(req: Request) {
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = quotePayloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { contactInfo, parts, currencyPreference } = parsed.data

  const partsHtml = parts
    .map(
      (p, i) => `
    <h3>Part ${i + 1}</h3>
    <ul>
      <li><strong>Brand:</strong> ${escapeHtml(p.brand || "—")}</li>
      <li><strong>Model:</strong> ${escapeHtml(p.model || "—")}</li>
      <li><strong>Year:</strong> ${escapeHtml(p.year || "—")}</li>
      <li><strong>Description:</strong> ${escapeHtml(p.partName)}</li>
      <li><strong>Qty:</strong> ${escapeHtml(p.quantity)}</li>
      <li><strong>OEM #:</strong> ${escapeHtml(p.partNumber || "—")}</li>
    </ul>`,
    )
    .join("")

  const html = `
    <h2>New quote request — LTY.LTD website</h2>
    <p><strong>Currency preference:</strong> ${escapeHtml(currencyPreference)}</p>
    <h3>Contact</h3>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(contactInfo.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(contactInfo.email)}</li>
      ${contactInfo.company ? `<li><strong>Company:</strong> ${escapeHtml(contactInfo.company)}</li>` : ""}
      <li><strong>Phone:</strong> ${escapeHtml(contactInfo.phone)}</li>
      <li><strong>Country:</strong> ${escapeHtml(contactInfo.country)}</li>
    </ul>
    ${contactInfo.notes ? `<p><strong>Notes:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(contactInfo.notes)}</pre>` : ""}
    ${partsHtml}
  `

  const result = await sendTransactionalEmail({
    subject: `Quote request from ${contactInfo.name}`,
    html,
    replyTo: contactInfo.email,
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: "Email could not be sent. Please try WhatsApp or email us directly." },
      { status: 503 },
    )
  }

  return NextResponse.json({ ok: true, id: result.id })
}

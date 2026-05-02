import { NextResponse } from "next/server"
import { contactPayloadSchema } from "@/lib/api-schemas"
import { sendTransactionalEmail } from "@/lib/email"
import { escapeHtml } from "@/lib/escape-html"

/** Edge-friendly so the same routes work on Cloudflare Workers / Pages. */
export const runtime = "edge"

const MAX_BODY_BYTES = 48_000

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

  const parsed = contactPayloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { name, email, company, phone, message } = parsed.data

  const html = `
    <h2>New contact form — LTY.LTD website</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
  `

  const result = await sendTransactionalEmail({
    subject: `Website contact from ${name}`,
    html,
    replyTo: email,
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: "Email could not be sent. Please try WhatsApp or email us directly." },
      { status: 503 },
    )
  }

  return NextResponse.json({ ok: true, id: result.id })
}

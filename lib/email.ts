const DEFAULT_TO = "info@ltyway.co.uk"

export function isEmailConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return false
  if (process.env.NODE_ENV !== "production") return true
  const from = process.env.CONTACT_EMAIL_FROM?.trim()
  return Boolean(from && !from.includes("onboarding@resend.dev"))
}

type SendResult =
  | { ok: true; id?: string }
  | { ok: false; error: string }

/** Sends mail via Resend HTTP API (no SDK dependency). */
export async function sendTransactionalEmail(params: {
  subject: string
  html: string
  replyTo?: string
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured." }
  }

  const to = process.env.CONTACT_EMAIL_TO?.trim() || DEFAULT_TO
  const fromEnv = process.env.CONTACT_EMAIL_FROM?.trim()
  const isProd = process.env.NODE_ENV === "production"

  if (isProd && (!fromEnv || fromEnv.includes("onboarding@resend.dev"))) {
    return {
      ok: false,
      error:
        "Set CONTACT_EMAIL_FROM to a sender on your verified domain in Resend (see docs/CLOUDFLARE.md).",
    }
  }

  const from = fromEnv || "LTY.LTD <onboarding@resend.dev>"

  const body: Record<string, unknown> = {
    from,
    to: [to],
    subject: params.subject,
    html: params.html,
  }
  if (params.replyTo?.trim()) {
    body.reply_to = params.replyTo.trim()
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const json = (await res.json()) as { id?: string; message?: string; name?: string }

  if (!res.ok) {
    const msg =
      typeof json.message === "string"
        ? json.message
        : `Resend error (${res.status})`
    return { ok: false, error: msg }
  }

  return { ok: true, id: json.id }
}

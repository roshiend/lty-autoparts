# Cloudflare: SSL, hosting, email forwarding, production checklist

This app is configured for **HTTPS**, **security headers** (`middleware.ts`), **API routes** for contact/quote (via **OpenNext for Cloudflare Workers** + `nodejs_compat`), and **Resend** for outbound form mail. Inbound mail uses **Cloudflare Email Routing** (forwarding); that does not replace Resend for website forms.

Repo wiring: **`wrangler.jsonc`**, **`open-next.config.ts`**, **`pnpm run pages:build`** (OpenNext), **`pnpm run deploy:cf`** (build + Wrangler deploy).

## Launch on Cloudflare (quick path)

1. **Install** — From the project root: `pnpm install`.
2. **Log in to Wrangler** (once): `pnpm exec wrangler login`.
3. **Secrets / vars for production** — In [Workers & Pages](https://dash.cloudflare.com/) → your Worker (`lty-ltd-site`, or rename `"name"` in `wrangler.jsonc` if the name is taken) → **Settings** → **Variables and Secrets**, add:
   - `NEXT_PUBLIC_SITE_URL` — `https://ltyway.co.uk` (or your canonical URL, no trailing slash)
   - `RESEND_API_KEY` — **Secret**
   - `CONTACT_EMAIL_TO` — `info@ltyway.co.uk`
   - `CONTACT_EMAIL_FROM` — e.g. `LTY.LTD <quotes@ltyway.co.uk>` (verified in Resend)
4. **Deploy from your PC** — `pnpm run deploy:cf` (runs `opennextjs-cloudflare build` then deploy).

**Or connect GitHub:** Workers & Pages → **Create** → **Workers** → **Connect Git** → pick `roshiend/lty-autoparts` (or your repo). Set:

- **Build command:** `pnpm install && pnpm run pages:build`
- **Deploy command / Wrangler:** Cloudflare often detects `wrangler.jsonc`; if it asks for install root, use repo root.

Then attach **Custom domains**: **Workers** → your deployment → **Triggers** / **Custom domains** → add `ltyway.co.uk` / `www` as needed (DNS must be on Cloudflare).

**Local smoke test (optional):** Copy `.dev.vars.example` → `.dev.vars`, fill values, run `pnpm run preview:cf`.

## Production checklist

1. **`NEXT_PUBLIC_SITE_URL`** — Set in Cloudflare Pages (and locally for preview) to your canonical URL, e.g. `https://www.yourdomain.com` (no trailing slash). Used for sitemap, robots, and Open Graph.
2. **`RESEND_API_KEY`** — From [Resend](https://resend.com); add as an encrypted secret in Pages.
3. **`CONTACT_EMAIL_TO`** — Where form submissions are delivered (your Gmail is fine).
4. **`CONTACT_EMAIL_FROM`** — **Required in production:** a sender on a domain you verify in Resend (e.g. `LTY.LTD <quotes@yourdomain.com>`). Do not rely on `onboarding@resend.dev` in production; the API will reject sends until this is set.
5. **DNS (Cloudflare)** — After verifying the domain in Resend, add the **TXT/CNAME** records Resend shows (SPF, DKIM; DMARC recommended).
6. **SSL/TLS** — Mode **Full** or **Full (strict)** when the origin serves HTTPS.
7. **Email Routing** (optional, for **inbound** `info@`): Email → Email Routing → create `info@yourdomain.com` → destination mailbox. This is separate from form delivery via Resend.

## 1. Inbound email forwarding (Cloudflare Email Routing)

Customers emailing your domain address (e.g. `info@ltyway.co.uk`) does **not** use Resend — Cloudflare routes it to your destination mailbox.

Example for **ltyway.co.uk**: **Email Routing** is set so **`info@ltyway.co.uk`** → **`lty.housereboot@gmail.com`**. That covers **inbound** mail from customers.

For **website forms**, configure **`CONTACT_EMAIL_TO=info@ltyway.co.uk`** in Pages/secrets so **Resend** delivers submissions to the same address; Email Routing then forwards those messages to Gmail alongside normal email.

1. **Email** → **Email Routing** → enable for the zone.
2. **Create address** → e.g. `info@ltyway.co.uk` → **Send to** your Gmail (or other inbox).
3. Cloudflare adds **MX** (and related) records automatically.

Replies from Gmail will show as Gmail unless you use **Send mail as** or Google Workspace. **Website forms** send outbound via **Resend** to `CONTACT_EMAIL_TO` (using `info@ltyway.co.uk` matches this routing setup).

## 2. Deploying the Next.js app on Cloudflare

Full-stack Next.js (App Router, API routes, SSR) on Cloudflare typically uses the **OpenNext Cloudflare** adapter and **Wrangler**. Official docs: [OpenNext — Cloudflare](https://opennext.js.org/cloudflare/get-started) and [Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

### Already wired in this repo

- **`@opennextjs/cloudflare`** and **`wrangler`** are devDependencies; **`open-next.config.ts`** and **`wrangler.jsonc`** are committed.
- **`export const runtime = "edge"`** was removed from `/api/*` (required by OpenNext Cloudflare).
- **`pnpm run pages:build`** — production bundle for Workers.
- **`pnpm run deploy:cf`** — build and deploy via Wrangler CLI.

If `migrate` was never run on your machine, you don’t need it here—the same files are already present.

### Environment variables on Workers

Mirror `.env.example` in the dashboard:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `RESEND_API_KEY` | Secret |
| `CONTACT_EMAIL_TO` | Recipient |
| `CONTACT_EMAIL_FROM` | Verified sender (production) |

`CF_PAGES_URL` is available automatically on Cloudflare Pages builds; still set `NEXT_PUBLIC_SITE_URL` for stable SEO.

### Other hosts (Vercel, Node)

Standard **`pnpm build`** / **`pnpm start`** works. Set the same env vars; no Wrangler required.

## 3. Outbound forms (Resend) + DNS

1. Create an API key → `RESEND_API_KEY`.
2. Verify **your domain** in Resend; add DNS records in Cloudflare.
3. Set `CONTACT_EMAIL_FROM` to an address on that domain.
4. Set `CONTACT_EMAIL_TO` to the inbox that should receive submissions (can match Email Routing destination).

## 4. Static asset caching

`public/_headers` sets long-lived caching for `/_next/static/*` on Cloudflare Pages. Other hosts may ignore `_headers`; that is harmless.

## 5. Analytics

**Vercel Analytics** (`@vercel/analytics`) loads only after cookie consent. You can add **Cloudflare Web Analytics** or **Zaraz** in the Cloudflare dashboard without code changes if you prefer edge-native analytics.

## 6. Rate limiting

Consider **Cloudflare WAF / Rate limiting rules** for `/api/contact` and `/api/quote` to reduce abuse. Rules are configured in the dashboard, not in this repo.

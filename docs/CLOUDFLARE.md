# Cloudflare: hosting, SSL, and email

This project can run on **Cloudflare Pages** (or Workers). API routes (`/api/contact`, `/api/quote`) use the **Edge** runtime so they run on Cloudflare’s network.

## 1. SSL / HTTPS

With your domain on Cloudflare (nameservers pointing to Cloudflare):

1. **SSL/TLS** → set mode to **Full** or **Full (strict)** once your origin is serving HTTPS.
2. **Universal SSL** issues certificates for your hostname automatically (no manual cert purchase for the edge).
3. For **Cloudflare Pages**, the Pages URL and any **custom domain** you attach also get managed certificates automatically.

You do **not** need to install a separate certificate in the Next.js app for the public site when using Cloudflare’s proxy.

## 2. Deploy the site (Cloudflare Pages)

1. Put the repo on GitHub/GitLab.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo and set:
   - **Build command:** `pnpm install` (or `npm ci`) then `pnpm build` / `npm run build`
   - **Build output directory:** depends on the adapter you use:
     - Default **Next.js** preset on Pages may output to `.vercel/output/static` when using the official Cloudflare Next integration, **or**
     - Follow [Cloudflare’s current Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/) docs for the exact **output directory** and any wrapper (e.g. OpenNext) they recommend for your Next.js version.
4. **Environment variables** (Pages → Settings → Environment variables) — mirror `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` — `https://your-domain.com` (no trailing slash)
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL_TO` — where Resend delivers form submissions (often your Gmail if you forward there; see below)
   - `CONTACT_EMAIL_FROM` — after Resend domain verification (see §4)

## 3. Email forwarding to Gmail (Cloudflare Email Routing)

**Inbound** mail (customers emailing `info@yourdomain.com`) does **not** use Resend. Use **Cloudflare Email Routing** (free on many zones):

1. **Email** → **Email Routing** → enable for your domain.
2. **Routing rules** → **Create address** e.g. `info@yourdomain.com` → **Send to** your Gmail address.
3. Cloudflare adds the required **MX** (and related) records automatically when you use Email Routing.

Then **replies** you send from Gmail will come from your Gmail unless you configure “Send mail as” for your domain (Google Workspace or careful SMTP setup). For **website forms**, outbound uses **Resend** (below), not Email Routing.

## 4. Outbound form email (Resend) + DNS on Cloudflare

Contact/quote forms send via **Resend** (`lib/email.ts`). You must:

1. Create a [Resend](https://resend.com) API key → set `RESEND_API_KEY` in Cloudflare Pages.
2. **Verify your domain** in Resend and add the **DNS records** Resend shows (usually **SPF**, **DKIM**, sometimes **DMARC**) in **Cloudflare → DNS** for `yourdomain.com`.
3. Set `CONTACT_EMAIL_FROM` to something like `LTY.LTD <quotes@yourdomain.com>` on that verified domain.
4. Set `CONTACT_EMAIL_TO` to the inbox where you want submissions — e.g. your **Gmail** address, or `info@yourdomain.com` if that forwards to Gmail via Email Routing (Resend will deliver to that mailbox).

Resend + Email Routing are complementary: **Resend = website → you**, **Email Routing = people → your domain → Gmail**.

## 5. DNS summary (typical)

| Purpose              | Where configured |
|----------------------|------------------|
| Site + SSL           | Domain proxied through Cloudflare; Pages custom domain |
| Forward `info@` → Gmail | Cloudflare Email Routing |
| Form delivery        | Resend → `CONTACT_EMAIL_TO` |
| Resend deliverability| TXT/CNAME from Resend dashboard in Cloudflare DNS |

## 6. `NEXT_PUBLIC_SITE_URL`

Set this to your **canonical public URL** so `sitemap.xml` and `robots.txt` use the correct host in production.

import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LEGAL_CONTACT } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy | LTY.LTD",
  description:
    "Information about cookies and similar technologies used on the LTY.LTD website.",
}

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="2 May 2026">
      <section>
        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the site work properly,
          remember preferences, and (with your consent where required) understand how visitors use the site. Similar
          technologies include local storage and pixels.
        </p>
      </section>

      <section>
        <h2>2. How we use cookies</h2>
        <p>
          LTY.LTD uses cookies and related technologies on this website for the purposes described below. We minimise
          data collection and align our practices with UK GDPR and the Privacy and Electronic Communications Regulations
          (PECR) where applicable.
        </p>
      </section>

      <section>
        <h2>3. Types of cookies we use</h2>

        <h3>Strictly necessary</h3>
        <p>
          These cookies are required for the website to function (for example security, load balancing, or remembering
          choices essential to using the site). They do not require consent under UK rules, but you can block them in
          your browser — parts of the site may then not work.
        </p>

        <h3>Analytics and performance</h3>
        <p>
          We may use analytics tools to collect aggregated information about visits (for example pages viewed, approximate
          region, device type). Our site may use{" "}
          <strong className="text-foreground">Vercel Analytics</strong> or similar services in production to understand
          traffic and improve performance. Such tools typically use cookies or local storage with pseudonymous identifiers.
        </p>
        <p>
          Where analytics cookies are not strictly necessary, we ask for consent using the cookie banner on your first
          visit. If you choose &quot;Essential only&quot;, analytics scripts do not load. If you choose &quot;Accept analytics&quot;,
          we enable Vercel Analytics in production. Your choice is stored in{" "}
          <strong className="text-foreground">local storage</strong> on your device (not a tracking cookie) so we do not
          ask again on every page.
        </p>

        <h3>Functional preferences</h3>
        <p>
          If we offer features such as currency selection or saved preferences, we may store related information on your
          device to remember your choices for subsequent visits.
        </p>
      </section>

      <section>
        <h2>4. Third-party services</h2>
        <p>
          Some cookies may be set by third parties — for example our hosting or analytics providers. Their use is subject
          to their respective privacy notices. We do not control third-party cookies beyond selecting reputable providers
          and configuring them responsibly.
        </p>
      </section>

      <section>
        <h2>5. Managing cookies</h2>
        <p>You can control cookies through your browser settings:</p>
        <ul>
          <li>Block all cookies or only third-party cookies;</li>
          <li>Delete cookies already stored;</li>
          <li>Use private or incognito mode to limit persistent storage.</li>
        </ul>
        <p>
          Blocking some cookies may affect site functionality. For guidance, see your browser&apos;s help pages (Chrome,
          Firefox, Safari, Edge, etc.).
        </p>
      </section>

      <section>
        <h2>6. Updates</h2>
        <p>
          We may update this Cookie Policy when our practices or legal requirements change. The &quot;Last updated&quot; date at
          the top reflects the latest revision.
        </p>
      </section>

      <section>
        <h2>7. More information</h2>
        <p>
          For how we process personal data more broadly, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>. Questions:{" "}
          <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>.
        </p>
      </section>
    </LegalPage>
  )
}

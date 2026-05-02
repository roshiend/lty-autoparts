import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LEGAL_CONTACT } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy | LTY.LTD",
  description:
    "How LTY.LTD collects, uses, and protects personal data when you use our website and services.",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="2 May 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          LTY.LTD (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we
          collect, use, store, and share personal data when you visit{" "}
          <Link href="/">our website</Link>, use our contact or quote forms, communicate with us (including via WhatsApp or
          email), or otherwise engage with our business based in the United Kingdom.
        </p>
        <p>
          We process personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data
          Protection Act 2018. For the purposes of those laws, we are usually the data controller of the personal data
          described in this policy.
        </p>
      </section>

      <section>
        <h2>2. Who we are</h2>
        <p>
          <strong className="text-foreground">LTY.LTD</strong>
          <br />
          Birmingham, United Kingdom
          <br />
          Email:{" "}
          <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
          <br />
          Phone / WhatsApp: <span className="tabular-nums">{LEGAL_CONTACT.phone}</span>
        </p>
      </section>

      <section>
        <h2>3. Personal data we may collect</h2>
        <p>Depending on how you interact with us, we may collect:</p>
        <ul>
          <li>
            <strong className="text-foreground">Identity and contact details</strong> — name, company name, email
            address, telephone number, billing or delivery address, and country.
          </li>
          <li>
            <strong className="text-foreground">Enquiry and order information</strong> — vehicle details (e.g. brand,
            model, year), part descriptions, OEM part numbers, quantities, messages you send us, and records of quotes or
            orders.
          </li>
          <li>
            <strong className="text-foreground">Technical and usage data</strong> — IP address, browser type, device
            type, general location (e.g. country or region), pages viewed, referring URLs, and similar analytics data
            collected via cookies or similar technologies (see our{" "}
            <Link href="/cookies">Cookie Policy</Link>).
          </li>
          <li>
            <strong className="text-foreground">Communications</strong> — content of emails, form submissions, and
            messages sent through WhatsApp or other channels when you contact us.
          </li>
        </ul>
        <p>We do not intentionally collect special categories of personal data unless you choose to provide them.</p>
      </section>

      <section>
        <h2>4. How we use your personal data</h2>
        <p>We use personal data to:</p>
        <ul>
          <li>Respond to enquiries, provide quotes, and fulfil orders for vehicle spare parts;</li>
          <li>Communicate with you about products, availability, shipping, and customer support;</li>
          <li>Operate, secure, and improve our website and internal processes;</li>
          <li>Comply with legal obligations (e.g. tax, customs, or regulatory requirements where applicable);</li>
          <li>Protect our legal rights and prevent fraud or misuse of our services.</li>
        </ul>
      </section>

      <section>
        <h2>5. Legal bases for processing (UK GDPR)</h2>
        <p>We rely on one or more of the following, as appropriate:</p>
        <ul>
          <li>
            <strong className="text-foreground">Contract</strong> — processing necessary to take steps at your request
            before a contract, or to perform a contract with you.
          </li>
          <li>
            <strong className="text-foreground">Legitimate interests</strong> — for example running our business,
            improving our website, analytics (where permitted), and supporting customers, balanced against your rights.
          </li>
          <li>
            <strong className="text-foreground">Legal obligation</strong> — where we must process data to comply with
            the law.
          </li>
          <li>
            <strong className="text-foreground">Consent</strong> — where we ask for your consent (for example certain
            non-essential cookies or marketing, if offered). You may withdraw consent at any time.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Sharing and international transfers</h2>
        <p>
          We may share personal data with service providers who assist us (for example hosting, email delivery, or
          analytics), strictly under contractual terms that require them to protect your data and use it only for the
          purposes we specify.
        </p>
        <p>
          Because we supply parts globally, your information may be processed in the UK, the European Economic Area, or
          other countries. Where we transfer personal data outside the UK/EEA, we use appropriate safeguards such as the
          UK International Data Transfer Agreement or adequacy regulations, where required.
        </p>
        <p>We may disclose information when required by law or to protect our rights and the safety of others.</p>
      </section>

      <section>
        <h2>7. Retention</h2>
        <p>
          We keep personal data only as long as necessary for the purposes described above, including satisfying legal,
          accounting, or reporting requirements. Retention periods vary depending on the nature of the data and whether an
          ongoing business relationship exists.
        </p>
      </section>

      <section>
        <h2>8. Your rights</h2>
        <p>Under UK data protection law you may have the right to:</p>
        <ul>
          <li>Access your personal data;</li>
          <li>Rectify inaccurate data;</li>
          <li>Erase data in certain circumstances;</li>
          <li>Restrict or object to processing in certain circumstances;</li>
          <li>Data portability, where applicable;</li>
          <li>Withdraw consent where processing is based on consent;</li>
          <li>Lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) —{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>
            .
          </li>
        </ul>
        <p>
          To exercise your rights, contact us using the details in section 2. We may need to verify your identity before
          responding.
        </p>
      </section>

      <section>
        <h2>9. Security</h2>
        <p>
          We implement appropriate technical and organisational measures designed to protect personal data against
          unauthorised access, alteration, disclosure, or destruction. No method of transmission over the internet is
          completely secure; we encourage you to use strong passwords and caution when sharing sensitive information.
        </p>
      </section>

      <section>
        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will change when we
          do. Continued use of our website after changes constitutes acceptance of the updated policy where permitted by
          law.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about this Privacy Policy or our use of personal data:{" "}
          <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
          {" "}or <span className="tabular-nums">{LEGAL_CONTACT.phone}</span> (WhatsApp).
        </p>
      </section>
    </LegalPage>
  )
}

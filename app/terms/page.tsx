import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LEGAL_CONTACT } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service | LTY.LTD",
  description:
    "Terms and conditions for using the LTY.LTD website and purchasing used vehicle spare parts.",
}

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="2 May 2026">
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website operated by LTY.LTD
          (&quot;we&quot;, &quot;us&quot;) and any enquiries, quotes, or orders you place with us for used vehicle spare parts.
          By using our website or engaging our services, you agree to these Terms. If you do not agree, please do not use
          our website or services.
        </p>
        <p>
          If you are using our services on behalf of a business, you confirm that you have authority to bind that
          business to these Terms.
        </p>
      </section>

      <section>
        <h2>2. About our services</h2>
        <p>
          We supply quality-checked <strong className="text-foreground">used</strong> automotive spare parts for European
          and UK vehicles. Parts are described in good faith based on inspection, grading, and available information.
          Images, catalogue data, and sample listings on our website (including any search or demonstration inventory) are
          for guidance only and do not guarantee availability, exact appearance, or suitability until confirmed in writing
          for your specific order.
        </p>
      </section>

      <section>
        <h2>3. Quotes, orders, and acceptance</h2>
        <ul>
          <li>
            Quotes provided via email, WhatsApp, telephone, or forms are invitations to treat unless expressly stated
            otherwise. A contract is formed when we confirm acceptance of your order (including payment instructions
            where applicable) or dispatch goods in line with agreed terms.
          </li>
          <li>
            You are responsible for providing accurate vehicle identification, part numbers, and delivery details.
            Incorrect information may affect compatibility and is not our fault where reasonably relied upon.
          </li>
          <li>
            We may refuse or cancel orders (with refund of amounts paid for undelivered goods, where applicable) for
            reasons including stock unavailability, pricing errors, export restrictions, or suspected fraud.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Pricing, payment, and taxes</h2>
        <p>
          Prices are quoted in the currency agreed (often GBP) unless otherwise stated. You are responsible for any
          applicable duties, taxes, VAT, customs charges, or brokerage fees in your destination country unless we
          explicitly agree to deliver duty-paid. Payment terms (including deposits, pro forma, or credit) will be
          confirmed when you place an order.
        </p>
      </section>

      <section>
        <h2>5. Delivery and risk</h2>
        <p>
          Delivery dates are estimates unless we agree a fixed date in writing. Risk of loss or damage passes in
          accordance with the agreed Incoterms or, if none are stated, when the goods are handed to the first carrier for
          export. You must inspect goods on receipt and notify us of transit damage within the period stated in our
          delivery documentation or, if none, within seven (7) days of delivery.
        </p>
      </section>

      <section>
        <h2>6. Used parts — condition, warranty, and returns</h2>
        <p>
          Used parts are sold subject to the condition and grading communicated at the point of sale. Unless we provide a
          separate written warranty for a specific item, used parts are supplied <strong className="text-foreground">as
          described and without additional warranty</strong> beyond your statutory rights as a consumer (where applicable)
          or any mandatory implied terms that cannot be excluded by law.
        </p>
        <p>
          Returns are handled case by case. Wrong parts supplied by us or parts materially not as described may be
          eligible for replacement, repair, or refund as required by law or our written returns policy at the time of
          purchase. Parts fitted incorrectly, damaged after delivery, or ordered incorrectly by the buyer may not be
          returnable.
        </p>
      </section>

      <section>
        <h2>7. Limitation of liability</h2>
        <p>
          Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence,
          fraud, or any other liability that cannot be excluded under English law.
        </p>
        <p>
          Subject to the foregoing, we are not liable for indirect or consequential loss (including loss of profit,
          business, or goodwill), or for any loss arising from delay in delivery except where such exclusion is
          prohibited. Our total liability arising out of any order shall not exceed the amount paid by you for that order
          unless a higher amount is required by law.
        </p>
        <p>
          You are responsible for ensuring parts are suitable for your vehicle and installed by a competent person. We
          are not liable for installation errors or misuse.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          Content on this website (text, layout, logos, and graphics where owned by us) is protected by intellectual
          property laws. You may not copy, scrape, or reuse our content for commercial purposes without permission.
          Vehicle manufacturer names and trademarks belong to their respective owners and are used for identification
          only.
        </p>
      </section>

      <section>
        <h2>9. Website use</h2>
        <p>You agree not to misuse our website (for example by introducing malware, attempting unauthorised access, or
          interfering with other users). We may suspend access where we reasonably believe these Terms are breached.</p>
      </section>

      <section>
        <h2>10. Governing law and jurisdiction</h2>
        <p>
          These Terms are governed by the laws of England and Wales. The courts of England and Wales shall have exclusive
          jurisdiction to resolve disputes, except where mandatory consumer protection laws in your country give you the
          right to bring proceedings elsewhere.
        </p>
      </section>

      <section>
        <h2>11. Privacy and cookies</h2>
        <p>
          Our use of personal data is described in our{" "}
          <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
          {" "}or <span className="tabular-nums">{LEGAL_CONTACT.phone}</span>.
        </p>
      </section>
    </LegalPage>
  )
}

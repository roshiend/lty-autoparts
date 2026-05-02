import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const CONTACT_EMAIL = "info@ltyway.co.uk"
const PHONE_INTL = "+44 7353 259996"

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16 sm:pt-32 md:pt-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />
            Back to Home
          </Link>
          <article>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mb-10 border-b border-border pb-8">
              Last updated: {lastUpdated}
            </p>
            <div
              className="text-sm leading-relaxed text-muted-foreground space-y-6 [&_section]:scroll-mt-28
              [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:first:mt-0
              [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:mb-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1
              [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent/90"
            >
              {children}
            </div>
            <p className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground">
              This page is provided for general information. It does not constitute legal advice. You may wish to obtain
              independent legal advice regarding your specific circumstances.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export const LEGAL_CONTACT = { email: CONTACT_EMAIL, phone: PHONE_INTL }

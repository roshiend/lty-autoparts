import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-background pt-28 pb-16 sm:pt-32 md:pt-36">
        <div className="mx-auto max-w-lg px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
          <p className="text-muted-foreground mb-8">
            That URL doesn&apos;t exist or has moved. Try the home page or parts search.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Browse parts</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function BetalingGeannuleerdPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Betaling geannuleerd</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">Geen probleem</h1>
          <p className="text-slate-600 mt-4">
            Je betaling is geannuleerd. Je kunt rustig blijven oefenen of later alsnog een pakket kiezen.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-slate-900 hover:bg-blue-600 text-white">
              <Link href="/pricing">Bekijk pakketten</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200">
              <Link href="/leren">Start gratis</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

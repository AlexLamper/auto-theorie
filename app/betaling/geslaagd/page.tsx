import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function BetalingGeslaagdPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-emerald-600">Betaling geslaagd</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">Welkom bij Auto Theorie</h1>
          <p className="text-slate-600 mt-4">
            Je betaling is ontvangen. Je toegang is nu actief en je voortgang wordt automatisch opgeslagen.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/leren">Start met leren</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200">
              <Link href="/oefenexamens">Doe een proefexamen</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

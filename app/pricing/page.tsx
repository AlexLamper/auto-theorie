import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle, CreditCard } from "lucide-react"

const plans = [
  {
    name: "Auto dag",
    id: "auto-dag",
    price: "19,99",
    note: "24 uur toegang",
    features: [
      "Volledige toegang tot lessen",
      "Alle oefenexamens",
      "Directe feedback",
    ],
  },
  {
    name: "Auto week",
    id: "auto-week",
    price: "29,99",
    note: "7 dagen toegang",
    features: [
      "Volledige toegang tot lessen",
      "Alle oefenexamens",
      "Voortgang wordt opgeslagen",
    ],
  },
  {
    name: "Auto maand",
    id: "auto-maand",
    price: "39,99",
    oldPrice: "79,99",
    note: "30 dagen toegang",
    highlight: "50% korting",
    features: [
      "Volledige toegang tot lessen",
      "Alle oefenexamens",
      "Premium support",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold text-blue-600">Prijzen</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Kies jouw pakket</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Eenmalige betaling, directe toegang. Je kunt eerst gratis starten en later overstappen.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border bg-white p-6 shadow-sm ${
                plan.highlight ? "border-blue-200 ring-1 ring-blue-200" : "border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              {plan.highlight && (
                <span className="inline-flex mt-3 items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {plan.highlight}
                </span>
              )}
              <div className="mt-6">
                {plan.oldPrice && (
                  <p className="text-sm text-slate-400 line-through">EUR {plan.oldPrice}</p>
                )}
                <p className="text-3xl font-bold text-slate-900">EUR {plan.price}</p>
                <p className="text-sm text-slate-500 mt-2">{plan.note}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <form action="/api/checkout" method="POST" className="mt-6">
                <input type="hidden" name="plan" value={plan.id} />
                <Button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white">
                  Start met {plan.name}
                </Button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold">Direct toegang zonder gedoe</h2>
            <p className="text-slate-300 mt-3">
              Je hoeft pas een account aan te maken wanneer je betaalt. Zo kun je eerst rustig kijken of het bij je past.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/leren">Start gratis</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/aanmelden">Maak account aan</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

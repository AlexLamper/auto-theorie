import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle, CreditCard } from "lucide-react"

const plans = [
  {
    name: "Basic",
    id: "plan_basic",
    price: "29,99",
    note: "1 Dag (24 uur) toegang",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "Directe foutanalyse",
    ],
  },
  {
    name: "Pro",
    id: "plan_pro",
    price: "39,99",
    note: "7 Dagen toegang",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "Voortgang wordt opgeslagen",
    ],
  },
  {
    name: "Premium",
    id: "plan_premium",
    price: "39,00",
    oldPrice: "59,00",
    note: "31 Dagen (1 Maand) toegang",
    highlight: "Meest gekozen",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "100% Slaaggarantie methode",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <section>
          <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold text-blue-600">Prijzen</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3">Kies jouw pakket</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Eenmalige betaling, directe toegang. Je kunt eerst gratis starten en later overstappen.
          </p>
        </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border bg-card p-6 shadow-sm ${
                plan.highlight ? "border-blue-200 ring-1 ring-blue-200" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-foreground">{plan.name}</p>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              {plan.highlight && (
                <span className="inline-flex mt-3 items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {plan.highlight}
                </span>
              )}
              <div className="mt-6">
                {plan.oldPrice && (
                  <p className="text-sm text-muted-foreground line-through">EUR {plan.oldPrice}</p>
                )}
                <p className="text-3xl font-bold text-foreground">EUR {plan.price}</p>
                <p className="text-sm text-muted-foreground mt-2">{plan.note}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
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

        <section>
          <div className="container mx-auto px-4 py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Direct toegang zonder gedoe</h2>
            <p className="text-muted-foreground mt-3">
              Je hoeft pas een account aan te maken wanneer je betaalt. Zo kun je eerst rustig kijken of het bij je past.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-card text-foreground hover:bg-muted">
              <Link href="/leren">Start gratis</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/aanmelden">Maak account aan</Link>
            </Button>
          </div>
        </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

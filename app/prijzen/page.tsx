import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import Link from "next/link"
import { CheckCircle, CreditCard } from "lucide-react"

const plans = [
  {
    name: "Basic",
    id: "plan_basic",
    price: "19,99",
    note: "1 Dag (24 uur) toegang",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "1 Willekeurig examen (Poging)",
      "Directe foutanalyse",
    ],
  },
  {
    name: "Premium",
    id: "plan_premium",
    price: "29,99",
    oldPrice: "59,99",
    note: "31 Dagen (1 Maand) toegang",
    highlight: "Meest gekozen",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "7 Willekeurige examens (Pogingen)",
      "100% Slaaggarantie methode",
    ],
  },
  {
    name: "Pro",
    id: "plan_pro",
    price: "24,99",
    note: "7 Dagen toegang",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "3 Willekeurige examens (Pogingen)",
      "Voortgang wordt opgeslagen",
    ],
  },
]

const examBundles = [
  {
    id: "bundle_5",
    amount: 5,
    price: "14,95",
    perExam: "€2,99",
    oldPrice: null,
    highlight: false
  },
  {
    id: "bundle_10",
    amount: 10,
    price: "24,95",
    perExam: "€2,49",
    oldPrice: "29,90",
    highlight: true
  },
  {
    id: "bundle_20",
    amount: 20,
    price: "39,95",
    perExam: "€1,99",
    oldPrice: "59,80",
    highlight: false
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1">
        <section>
          <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Prijzen</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3">Kies jouw pakket</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Eenmalige betaling, directe toegang. Je kunt eerst gratis starten en later overstappen.
          </p>
        </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[2.5rem] border bg-white dark:bg-slate-900 p-8 transition-all duration-300 ${
                plan.highlight 
                  ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/10 dark:ring-blue-400/5 md:scale-110 md:z-10 shadow-2xl shadow-blue-500/20 md:py-12" 
                  : "border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-lg font-black uppercase tracking-tight ${plan.highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>{plan.name}</p>
                <CreditCard className={`h-5 w-5 ${plan.highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
              </div>
              {plan.highlight && (
                <span className="inline-flex mt-4 items-center rounded-full bg-blue-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30">
                  {plan.highlight}
                </span>
              )}
              <div className="mt-8">
                {plan.oldPrice && (
                  <p className="text-sm text-slate-400 dark:text-slate-600 line-through font-bold">EUR {plan.oldPrice}</p>
                )}
                <div className="flex items-baseline gap-1">
                   <p className={`text-4xl font-black ${plan.highlight ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"}`}>€ {plan.price}</p>
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">{plan.note}</p>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.highlight ? "text-blue-500" : "text-emerald-500"}`} />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/checkout" method="POST" className="mt-10">
                <input type="hidden" name="plan" value={plan.id} />
                <Button type="submit" className={`w-full h-14 rounded-2xl font-black text-lg transition-all cursor-pointer ${
                  plan.highlight 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-600/40 hover:scale-[1.02] active:scale-95" 
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                }`}>
                  Start met {plan.name}
                </Button>
              </form>
            </div>
          ))}
        </div>
        </section>

        {/* Exam Bundles Section */}
        <section className="container mx-auto px-4 pb-24 border-t border-slate-100 dark:border-slate-800 pt-16">
           <div className="text-center mb-12">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Flexibel Leren</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">Bundels van Examens</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                 Geen abonnement nodig. Jouw examens blijven onbeperkt in je account staan. Gebruik ze wanneer jij dat wilt.
              </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
             {examBundles.map((bundle) => (
                <div key={bundle.id} className="relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group">
                    {bundle.highlight && (
                       <div className="absolute -top-4 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wide">
                         Meest Gekozen
                       </div>
                    )}
                    
                    <div className="mb-4 bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-900 dark:text-white group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                       {bundle.amount}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{bundle.amount} Examens</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Slechts {bundle.perExam} per stuk</p>
                    
                    <div className="mt-8 mb-8">
                       {bundle.oldPrice && <p className="text-slate-400 dark:text-slate-600 line-through text-sm font-bold">EUR {bundle.oldPrice}</p>}
                       <p className="text-4xl font-black text-slate-900 dark:text-white">€ {bundle.price}</p>
                    </div>
                    
                    <form action="/api/checkout" method="POST" className="w-full mt-auto">
                        <input type="hidden" name="plan" value={bundle.id} />
                        <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20">
                          Bundel van {bundle.amount} kopen
                        </Button>
                    </form>
                </div>
             ))}
           </div>
        </section>

        <section>
          <div className="container mx-auto px-4 py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Direct toegang zonder gedoe</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">
              Je hoeft pas een account aan te maken wanneer je betaalt. Zo kun je eerst rustig kijken of het bij je past.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700">
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

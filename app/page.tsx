import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle,
  CreditCard,
  MessageCircle,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auto Theorie - Het Beste Platform voor je B Rijbewijs",
  description:
    "Oefen gratis voor je Nederlandse auto theorie-examen. Actuele vragen, proefexamens en verkeersborden. Geen registratie, 100% gratis.",
  openGraph: {
    title: "Auto Theorie - Slaag in een keer voor je B Rijbewijs",
    description:
      "Het meest complete gratis platform voor je auto theorie-examen. Oefen onbeperkt met actuele CBR-stijl vragen.",
    url: "https://auto-theorie.com",
  },
}

const stats = [
  { label: "Oefenvragen", value: "500+" },
  { label: "Verkeersborden", value: "90+" },
  { label: "Proefexamens", value: "Onbeperkt" },
  { label: "Tevreden leerlingen", value: "10.000+" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <section className="relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
        <div className="container mx-auto px-4 py-20 lg:py-28 relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 animate-fade-up">
                <Sparkles className="h-4 w-4" />
                CBR 2025/2026 Update
              </div>
              <div className="space-y-5 animate-fade-up animate-delay-1">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                  Slaag voor je <span className="text-blue-700 dark:text-blue-400">auto-theorie</span> op jouw tempo, zonder stress
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Alles wat je nodig hebt om in één keer te slagen: leren, oefenen en examens. Begin gratis en bewaar je voortgang.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-2">
                <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  <Link href="/leren">
                    Start direct met leren
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Link href="/oefenexamens">
                    <Trophy className="mr-2 h-5 w-5" />
                    Doe een proefexamen
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-up animate-delay-2">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-slate-100 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-800 blur-2xl opacity-80" />
              <div className="relative rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden p-2">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
                  <Image
                    src="/images/home/hero.png"
                    alt="Dashboard preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="voordelen" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Waarom kiezen voor Auto Theorie
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Professionele voorbereiding zonder ruis.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Een helder platform met focus op resultaat. Snel overzicht, consistente uitleg en een slimme flow van leren naar oefenen.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Actuele CBR-stijl", desc: "Vragen en uitleg in de nieuwste examenvorm." },
                  { title: "Slimme voortgang", desc: "Je ziet precies wat je al beheerst en wat nog open staat." },
                  { title: "Rustige interface", desc: "Geen drukte, wel focus en duidelijke stappen." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-4 bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white">
                <Link href="/leren">
                  Bekijk alle lessen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg">
                <div className="relative aspect-[16/9] w-full mb-6 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/home/leren.png"
                    alt="Leerling met tablet"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Gevaarherkenning", value: "92%" },
                    { label: "Verkeersregels", value: "88%" },
                    { label: "Borden", value: "95%" },
                    { label: "Examens", value: "Onbeperkt" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center">
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="werkwijze" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Zo werkt het</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 dark:text-white">In drie stappen klaar voor je examen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Stap 1: Leren", desc: "Volg de lessen per categorie met duidelijke uitleg." },
              { title: "Stap 2: Oefenen", desc: "Test jezelf met vragen en directe feedback." },
              { title: "Stap 3: Examen", desc: "Doe realistische proefexamens en behaal je score." },
            ].map((step) => (
              <div key={step.title} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Preview</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Probeer het gratis en stap daarna over.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Je kunt direct starten zonder account. Zodra je betaalt, wordt er automatisch een account aangemaakt en blijft je voortgang behouden.
              </p>
              <div className="space-y-4">
                {[
                  "Gratis toegang tot voorbeeldlessen en vragen",
                  "Volledige examens beschikbaar in betaalde bundels",
                  "Geen gedoe: inloggen pas bij betalen",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/prijzen">
                  Bekijk prijzen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
              <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                Afbeelding placeholder: preview van oefenexamen
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: "Beoordeling", value: "4.9/5" },
                  { label: "Gem. score", value: "82%" },
                  { label: "Nieuwe vragen", value: "Wekelijks" },
                  { label: "Support", value: "Binnen 24u" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prijzen" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Prijzen</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 dark:text-white">Kies het pakket dat bij je past</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Geen verplichtingen. Kies een pakket en krijg direct volledige toegang.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Auto dag", price: "19,99", note: "24 uur toegang" },
              { name: "Auto week", price: "29,99", note: "7 dagen toegang" },
              { name: "Auto maand", price: "39,99", note: "30 dagen toegang", old: "79,99" },
            ].map((plan) => (
              <div key={plan.name} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-6">
                  {plan.old && (
                    <p className="text-sm text-slate-400 dark:text-slate-600 line-through">EUR {plan.old}</p>
                  )}
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">EUR {plan.price}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{plan.note}</p>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />Volledige toegang tot leren</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />Alle oefenexamens</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />Voortgang opgeslagen</li>
                </ul>
                <Button asChild className="mt-6 bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white">
                  <Link href="/prijzen">Kies {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Veelgestelde vragen</h2>
              <div className="mt-6 space-y-6">
                {[
                  { q: "Kan ik gratis starten?", a: "Ja, je kunt direct beginnen met een selectie lessen en voorbeeldvragen." },
                  { q: "Wanneer moet ik inloggen?", a: "Inloggen is pas nodig bij betaling, zodat we je voortgang kunnen bewaren." },
                  { q: "Welke pakketten zijn er?", a: "Je kunt kiezen voor dag, week of maand toegang." },
                ].map((item) => (
                  <div key={item.q} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.q}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Support</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">We helpen je snel verder</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                Heb je een vraag? Bekijk de FAQ of neem direct contact met ons op.
              </p>
              <Button asChild className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/contact">Ga naar contact</Link>
              </Button>
              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 text-xs text-slate-500 dark:text-slate-400">
                Afbeelding placeholder: team support
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 dark:bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300 dark:text-slate-400">Klaar om te starten?</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">Zet vandaag de eerste stap richting je rijbewijs.</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900">
                <Link href="/leren">Start met leren</Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/prijzen">Bekijk pakketten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

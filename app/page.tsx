import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Car,
  CheckCircle,
  CreditCard,
  Clock,
  MessageCircle,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
  GraduationCap,
  Eye,
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
  { label: "Oefenvragen", value: "500+", icon: Target },
  { label: "Verkeersborden", value: "90+", icon: Car },
  { label: "Proefexamens", value: "50+", icon: BookOpen },
]

const features = [
  {
    title: "Actuele Theorie",
    desc: "Altijd up-to-date met de nieuwste regels van het CBR examen 2025/2026.",
    icon: BookOpen,
    accent: "bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Slimme Oefenvragen",
    desc: "Honderden vragen met directe feedback en uitgebreide uitleg.",
    icon: Target,
    accent: "bg-violet-500/10 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Realistische Examens",
    desc: "Oefen met proefexamens die precies zo werken als bij het CBR.",
    icon: Trophy,
    accent: "bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Verkeersborden Tool",
    desc: "Oefen alle borden met onze interactieve bordentraining.",
    icon: Car,
    accent: "bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Overal Oefenen",
    desc: "Werkt perfect op je mobiel, tablet en desktop. Waar je ook bent.",
    icon: Sparkles,
    accent: "bg-pink-500/10 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    title: "Direct Resultaat",
    desc: "Geen wachttijden, direct toegang na betaling of start gratis.",
    icon: Zap,
    accent: "bg-cyan-500/10 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
]

const plans = [
  {
    name: "Basic",
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
    name: "Pro",
    price: "24,99",
    note: "7 Dagen toegang",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "3 Willekeurige examens (Pogingen)",
      "Voortgang wordt opgeslagen",
    ],
  },
  {
    name: "Premium",
    price: "29,99",
    note: "31 Dagen (1 Maand) toegang",
    recommended: true,
    old: "59,99",
    features: [
      "Volledige toegang tot alle lessen",
      "Alle oefenexamens beschikbaar",
      "7 Willekeurige examens (Pogingen)",
      "100% Slaaggarantie methode",
    ],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-0 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent" />
          <div className="absolute -top-32 right-0 w-[55%] h-[55%] bg-gradient-to-br from-blue-200/30 to-violet-200/20 dark:from-blue-900/20 dark:to-violet-900/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 -left-20 w-[40%] h-[40%] bg-gradient-to-tr from-cyan-200/20 to-blue-100/10 dark:from-cyan-900/10 dark:to-blue-900/5 blur-[80px] rounded-full" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.35] dark:opacity-[0.08]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 dark:border-blue-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm px-5 py-2 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 animate-fade-up shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bijgewerkt voor CBR 2025 / 2026</span>
            </div>

            {/* Heading */}
            <div className="space-y-5 animate-fade-up animate-delay-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.08] tracking-tight">
                Haal je auto-theorie{" "}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  in één keer.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Het voordeligste platform om te leren voor je theorie-examen —
                complete lessen, oefenvragen en proefexamens op één plek.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 items-center animate-fade-up animate-delay-2 w-full sm:w-auto px-6 sm:px-0">
              <Button
                asChild
                size="lg"
                className="h-14 w-full sm:w-auto sm:px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.03] transition-all duration-200"
              >
                <Link href="/prijzen">
                  Aan de slag
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full sm:w-auto sm:px-10 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm"
              >
                <Link href="/oefenexamens">Proefexamen doen</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500 pt-2 animate-fade-up animate-delay-3">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                Veilig betalen via iDEAL
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                CBR-stijl examenvragen
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-violet-500" />
                Direct toegang
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 border-y border-slate-100 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center mb-1">
                  <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 space-y-4">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Waarom Auto&nbsp;Theorie?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Alles om in één keer <br className="hidden md:block" />
              te slagen.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
              Van verkeersregels tot gevaarherkenning — ons platform bereidt je volledig voor op het CBR examen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-7 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${feature.accent}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Showcase ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/40 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-14">
            <div className="space-y-5 max-w-2xl">
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                Leren met focus,
                <br />
                oefenen met vertrouwen.
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
                Onze interface is ontworpen om afleiding te voorkomen. We richten
                ons op wat echt telt: de stof begrijpen en klaar zijn voor het
                examen.
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-cyan-500/15 dark:from-blue-500/10 dark:via-violet-500/5 dark:to-cyan-500/10 blur-[60px] -z-10 rounded-[3rem]" />
              <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-700/40 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-1.5 sm:p-2 shadow-2xl shadow-slate-300/30 dark:shadow-black/20 overflow-hidden group">
                <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-slate-200/80 dark:ring-slate-700/40">
                  <Image
                    src="/images/home/hero.png"
                    alt="Dashboard preview"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              </div>
            </div>

            {/* Mini features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full max-w-4xl mx-auto">
              {[
                {
                  title: "Geen overbodige info",
                  desc: "Alleen de kennis die je nodig hebt voor het CBR examen.",
                  icon: Eye,
                },
                {
                  title: "Visueel leren",
                  desc: "Duidelijke illustraties en uitleg voor complexe situaties.",
                  icon: GraduationCap,
                },
                {
                  title: "Bespaar tijd",
                  desc: "Gemiddeld slechts 12 uur studietijd nodig om te slagen.",
                  icon: Clock,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25"
            >
              <Link href="/leren">Bekijk de lessen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="prijzen" className="py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-4">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Prijzen
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Zoveel tijd als jij nodig hebt.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-base">
              Kies het pakket dat bij jou past. Geen abonnement, eenmalige betaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-7 sm:p-8 rounded-2xl sm:rounded-3xl border flex flex-col transition-all duration-300 ${
                  plan.recommended
                    ? "border-blue-500/60 bg-white dark:bg-slate-900 md:scale-[1.04] shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 z-10 ring-1 ring-blue-500/20"
                    : "border-slate-150 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow-md">
                    Populairst
                  </div>
                )}

                <div className="space-y-3 mb-7 text-center">
                  <h3 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {plan.name}
                  </h3>
                  {plan.old && (
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 line-through">
                      EUR {plan.old}
                    </p>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-bold text-slate-400">€</span>
                    <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                    {plan.note}
                  </p>
                </div>

                <div className="flex-1 space-y-3.5 mb-7">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  size="lg"
                  className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
                    plan.recommended
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white"
                  }`}
                >
                  <Link href="/prijzen">Kies {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mt-12 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              iDEAL, PayPal &amp; Creditcard
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Direct na betaling starten
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" />
              Eenmalige betaling
            </span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 dark:from-blue-950/80 dark:via-slate-900 dark:to-slate-900 dark:border dark:border-blue-500/15 px-6 sm:px-12 py-14 md:py-20 overflow-hidden shadow-2xl">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-72 h-72 bg-blue-500/15 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-56 h-56 bg-cyan-500/10 blur-[80px] rounded-full" />

            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  Klaar om te slagen voor
                  <br className="hidden md:block" /> je theorie-examen?
                </h2>
                <p className="text-base sm:text-lg text-slate-300 dark:text-slate-400 max-w-xl mx-auto">
                  Begin vandaag nog met onze bewezen leermethode en ga met
                  vertrouwen naar het CBR.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-14 sm:h-16 w-full sm:w-auto px-10 sm:px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Link href="/prijzen">Bekijk de pakketten</Link>
                </Button>
                <Link
                  href="/informatie"
                  className="text-slate-300 hover:text-white font-semibold transition-colors underline decoration-slate-600 hover:decoration-blue-400 underline-offset-4 text-sm sm:text-base"
                >
                  Meer informatie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

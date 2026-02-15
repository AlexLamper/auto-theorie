import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
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
  { label: "Proefexamens", value: "50+" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <div className="min-h-[calc(100vh-80px)] flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex items-center py-12 lg:py-0 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent" />
            <div className="absolute -top-[5%] -right-[5%] w-[60%] lg:w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-900/20 blur-[120px] rounded-full" />
            <div className="absolute top-[10%] -left-[10%] w-[50%] lg:w-[30%] h-[30%] bg-purple-200/10 dark:bg-purple-900/10 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 animate-fade-up shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>CBR 2025/2026 Update</span>
              </div>
              
              <div className="space-y-4 sm:space-y-6 animate-fade-up animate-delay-1">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                  Je auto-theorie halen <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">moeiteloos & sneller.</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                  Het voordeligste platform om te leren voor je auto theorie-examen,
                  met complete lessen, oefenvragen en proefexamens op één plek.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-up animate-delay-2 w-full sm:w-auto px-6 sm:px-0">
                <Button asChild size="lg" className="h-14 w-full sm:w-auto sm:px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                  <Link href="/leren">
                    Start direct
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 w-full sm:w-auto sm:px-10 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 font-bold bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <Link href="/oefenexamens">
                    Proefexamen doen
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-500 pt-4 animate-fade-up animate-delay-3">
                <span><span className="font-bold text-slate-900 dark:text-slate-200">Start vandaag</span> met gericht oefenen voor je theorie-examen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-600/70 dark:text-blue-400/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 space-y-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">De Slimste Keuze</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Alles om in één keer <br className="hidden md:block" /> te slagen.
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                title: "Actuele Theorie", 
                desc: "Altijd up-to-date met de nieuwste regels van het CBR examen 2025/2026.",
                icon: BookOpen,
                color: "blue"
              },
              { 
                title: "Slimme Oefenvragen", 
                desc: "Honderden vragen met directe feedback en uitgebreide uitleg.",
                icon: Target,
                color: "purple"
              },
              { 
                title: "Realistische Examens", 
                desc: "Oefen met proefexamens die precies zo werken als bij het CBR.",
                icon: Trophy,
                color: "emerald"
              },
              { 
                title: "Verkeersborden Tool", 
                desc: "Oefen alle borden met onze interactieve bordentraining.",
                icon: Car,
                color: "orange"
              },
              { 
                title: "Overal Oefenen", 
                desc: "Werkt perfect op je mobiel, tablet en desktop. Waar je ook bent.",
                icon: Sparkles,
                color: "pink"
              },
              { 
                title: "Direct Resultaat", 
                desc: "Geen wachttijden, direct toegang na betaling of start gratis.",
                icon: CreditCard,
                color: "cyan"
              },
            ].map((feature) => (
              <div key={feature.title} className="group relative p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-12 animate-fade-up">
            <div className="space-y-6">
              <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-w-2xl px-4">
                Leren met focus, <br />
                oefenen met vertrouwen.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto px-4">
                Onze interface is ontworpen om afleiding te voorkomen. We richten ons op wat echt telt: 
                begrijpen van de stof en klaargestoomd worden voor het examen.
              </p>
            </div>
            {/* Moved hero image here for better fit */}
            <div className="relative w-full max-w-3xl mx-auto animate-fade-up animate-delay-3 px-4 sm:px-6">
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 blur-[60px] sm:blur-[80px] -z-10 rounded-[2rem] sm:rounded-[4rem]" />
              <div className="relative rounded-2xl sm:rounded-[2rem] border border-white/40 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md p-1.5 sm:p-2 shadow-2xl overflow-hidden group">
                <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
              {[
                { title: "Geen overbodige info", desc: "Alleen de kennis die je nodig hebt voor het CBR examen." },
                { title: "Visueel leren", desc: "Duidelijke illustraties en uitleg voor complexe verkeerssituaties." },
                { title: "Bespaar tijd", desc: "Gemiddeld hebben onze leerlingen slechts 12 uur studietijd nodig." },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{item.title}</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button asChild className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10">
                <Link href="/leren">Bekijk de lessen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Modernized */}
      <section id="prijzen" className="py-20 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-4">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Prijzen</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight px-4">Zoveel tijd als jij nodig hebt.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: "Basic", 
                price: "19,99", 
                note: "1 Dag (24 uur) toegang", 
                features: ["Volledige toegang tot alle lessen", "Alle oefenexamens beschikbaar", "1 Willekeurig examen (Poging)", "Directe foutanalyse"]
              },
              { 
                name: "Pro", 
                price: "24,99", 
                note: "7 Dagen toegang", 
                features: ["Volledige toegang tot alle lessen", "Alle oefenexamens beschikbaar", "3 Willekeurige examens (Pogingen)", "Voortgang wordt opgeslagen"]
              },
              { 
                name: "Premium", 
                price: "29,99", 
                note: "31 Dagen (1 Maand) toegang", 
                recommended: true,
                old: "59,99",
                features: ["Volledige toegang tot alle lessen", "Alle oefenexamens beschikbaar", "7 Willekeurige examens (Pogingen)", "100% Slaaggarantie methode"]
              },
            ].map((plan) => (
              <div key={plan.name} className={`relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border ${plan.recommended ? 'border-blue-500 bg-white dark:bg-slate-900 md:scale-105 shadow-2xl z-10' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shadow-sm'} flex flex-col transition-transform hover:scale-[1.02] md:hover:scale-[1.07] duration-500`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg">
                    Populairst
                  </div>
                )}
                
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold dark:text-white">{plan.name}</h4>
                  {plan.old && <p className="text-xs font-bold text-slate-400 dark:text-slate-600 line-through">EUR {plan.old}</p>}
                  <div className="flex items-baseline justify-center sm:justify-start gap-1">
                    <span className="text-xl font-bold">€</span>
                    <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.price}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{plan.note}</p>
                </div>

                <div className="flex-1 space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map(feat => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{feat}</span>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg" className={`w-full h-12 rounded-2xl font-bold text-lg transition-all ${plan.recommended ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white'}`}>
                  <Link href="/prijzen">Kies dit pakket</Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 dark:text-slate-500 mt-12 text-xs sm:text-sm max-w-md mx-auto px-4">
            Betalen kan veilig via iDEAL, PayPal of Creditcard. Direct na betaling kun je starten met leren en oefenen.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-3xl sm:rounded-[3rem] bg-slate-900 dark:bg-blue-600/10 dark:border dark:border-blue-500/20 px-6 sm:px-10 py-12 md:py-24 overflow-hidden shadow-2xl">
            {/* Design elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/20 blur-[60px] sm:blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-700/20 blur-[50px] sm:blur-[80px] rounded-full" />
            
            <div className="relative z-10 text-center space-y-8 sm:space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight px-4">
                  Klaar om in één keer te <br className="hidden md:block" /> slagen voor je theorie?
                </h2>
                <p className="text-base sm:text-lg text-slate-300 dark:text-blue-100 max-w-2xl mx-auto px-4">
                  Begin vandaag nog met onze bewezen leermethode. Geen account nodig om de eerste lessen te proberen.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="h-14 sm:h-16 w-full sm:w-auto px-10 sm:px-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-2xl text-lg sm:text-xl font-black shadow-xl transition-all hover:scale-105 active:scale-95">
                  <Link href="/leren">Start nu gratis</Link>
                </Button>
                <Link 
                  href="/prijzen" 
                  className="text-white hover:text-blue-200 font-bold transition-colors underline decoration-blue-500 underline-offset-8 text-sm sm:text-base"
                >
                  Bekijk alle pakketten
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

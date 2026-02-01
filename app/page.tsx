import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Car,
  Trophy,
  Users,
  Clock,
  CheckCircle,
  Shield,
  Star,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gratis Auto Theorie - Het Beste Platform voor je B Rijbewijs",
  description:
    "Oefen gratis voor je Nederlandse auto theorie-examen. Actuele vragen, proefexamens en verkeersborden. Geen registratie, 100% gratis.",
  openGraph: {
    title: "Gratis Auto Theorie - Slaag in één keer voor je B Rijbewijs",
    description:
      "Het meest complete gratis platform voor je auto theorie-examen. Oefen onbeperkt met actuele CBR-stijl vragen.",
    url: "https://gratis-theorie.com",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Volledig Gratis • Geen Registratie • CBR 2024/2025
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
            Slaag voor je <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">auto theorie-examen</span> in één keer.
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Het meest complete gratis platform van Nederland voor je B rijbewijs. Oefen onbeperkt met actuele vragen. Geen verborgen kosten.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300"
            >
              <Link href="/leren">
                Start direct met leren
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 rounded-full bg-transparent transition-all duration-300"
            >
              <Link href="/exams">
                <Trophy className="mr-2 h-5 w-5" />
                Doe een proefexamen
              </Link>
            </Button>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-100 pt-12">
            {[
              { label: "Oefenvragen", value: "500+", icon: CheckCircle },
              { label: "Verkeersborden", value: "90+", icon: Shield },
              { label: "Proefexamens", value: "Onbeperkt", icon: Target },
              { label: "Kosten", value: "€0", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  <stat.icon className="w-4 h-4" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Start direct met de Auto Theorie</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Alle content is up-to-date met de laatste CBR-richtlijnen voor het auto rijbewijs (B).
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Car className="w-32 h-32 text-blue-600" />
              </div>
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Car className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Auto Theorie (B)</h3>
                  <p className="text-slate-600 mb-6">
                    De meest complete gratis voorbereiding op het Nederlandse theorie-examen.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "500+ oefenvragen in CBR-stijl",
                      "Volledige gevaarherkenning",
                      "Alle verkeersregels en borden",
                      "Gratis proefexamens oefenen"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors" asChild size="lg">
                      <Link href="/leren">Start Theorie</Link>
                    </Button>
                    <Button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors" asChild variant="secondary" size="lg">
                      <Link href="/exams">Proefexamens</Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="aspect-square bg-blue-50 rounded-2xl flex items-center justify-center p-8 border border-blue-100">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                      <div className="text-slate-600 font-medium">Gratis Toegang</div>
                      <div className="mt-4 text-xs text-slate-400">Geen account nodig, begin direct</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traffic Signs Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Essentieel onderdeel
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Beheers alle <span className="text-blue-600">verkeersborden</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Verkeersborden vormen een cruciaal onderdeel van je theorie-examen (ongeveer 20-30% van de vragen). 
                Wij hebben ze allemaal voor je op een rijtje gezet, inclusief betekenis en categorie.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: "90+ Verkeersborden", desc: "Alle officiële borden uit het RVV", icon: Shield },
                  { title: "7 Categorieën", desc: "Overzichtelijk ingedeeld per type", icon: Target },
                  { title: "Interactief Leren", desc: "Test je kennis direct", icon: Star },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="bg-slate-900 hover:bg-blue-600 text-white px-8">
                <Link href="/verkeersborden">
                  Bekijk alle borden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-6">
                {/* Sample Signs */}
                {[
                  { label: "Stop", color: "bg-red-600", text: "STOP", shape: "octagon" },
                  { label: "Parkeren", color: "bg-blue-600", text: "P", shape: "square" },
                  { label: "Max 50", color: "bg-white border-4 border-red-600", text: "50", shape: "circle", textColor: "text-black" },
                  { label: "Voorrang", color: "bg-yellow-400", shape: "diamond" },
                  { label: "Verboden", color: "bg-white border-4 border-red-600", shape: "circle", icon: "line" },
                  { label: "Snelweg", color: "bg-blue-600", shape: "rect", icon: "road" },
                ].map((sign, i) => (
                  <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className={`w-16 h-16 mb-3 flex items-center justify-center font-bold text-white shadow-sm
                      ${sign.shape === 'octagon' ? 'clip-path-octagon' : 'rounded-lg'}
                      ${sign.shape === 'circle' ? 'rounded-full' : ''}
                      ${sign.shape === 'diamond' ? 'transform rotate-45 rounded-md' : ''}
                      ${sign.color}
                      ${sign.textColor || 'text-white'}
                    `}>
                      <span className={sign.shape === 'diamond' ? 'transform -rotate-45' : ''}>
                        {sign.text}
                        {sign.icon === 'line' && <div className="w-10 h-1 bg-red-600 transform -rotate-45"></div>}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{sign.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

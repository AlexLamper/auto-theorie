import Footer from "@/components/footer"
import { Car, Shield, Sparkles } from "lucide-react"

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <p className="text-sm font-semibold text-blue-600">Over ons</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Wij maken theorie leren helder en overzichtelijk</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl">
            Auto Theorie is gebouwd om leerlingen sneller en zekerder naar hun examen te begeleiden. Met duidelijke content,
            actuele vragen en een rustige interface zorgen we voor focus en resultaat.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              title: "Missie",
              description: "Iedere leerling toegang geven tot een professionele voorbereiding zonder onnodige drempels.",
              icon: Sparkles,
            },
            {
              title: "Focus",
              description: "Heldere uitleg, actuele examens en een strak leerpad met maximale rust.",
              icon: Car,
            },
            {
              title: "Kwaliteit",
              description: "We actualiseren content op basis van CBR-richtlijnen en feedback van leerlingen.",
              icon: Shield,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Onze aanpak</h2>
          <p className="text-slate-600 mt-3">
            We combineren korte, duidelijke lessen met oefenvragen in examenvorm. Je ziet direct waar je staat en waar je
            nog kunt verbeteren. Zo ga je zelfverzekerd het echte examen in.
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            Afbeelding placeholder: team of werkplek
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

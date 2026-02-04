import Footer from "@/components/footer"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "Kan ik gratis starten?",
    answer:
      "Ja, je kunt direct beginnen met een selectie lessen en voorbeeldvragen. Betalen is pas nodig voor volledige toegang.",
  },
  {
    question: "Wanneer moet ik inloggen?",
    answer:
      "Inloggen is pas nodig wanneer je een pakket kiest. Dan maken we automatisch een account aan.",
  },
  {
    question: "Hoe werkt de betaling?",
    answer:
      "Je betaalt eenmalig voor dag, week of maand. Daarna krijg je direct toegang tot alle content.",
  },
  {
    question: "Wordt mijn voortgang opgeslagen?",
    answer:
      "Ja, na betaling bewaren we je voortgang zodat je later verder kunt gaan waar je bleef.",
  },
  {
    question: "Zijn de vragen actueel?",
    answer:
      "Ja, de vragen zijn afgestemd op de nieuwste CBR-richtlijnen en worden regelmatig bijgewerkt.",
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Veelgestelde vragen</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Alles wat je wilt weten over Auto Theorie. Staat je vraag er niet bij? Neem contact met ons op.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="text-sm text-slate-600 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

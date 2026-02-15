"use client"

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  MessageCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-6">
            <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Contact</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Heb je vragen, feedback of suggesties? We helpen je graag snel en persoonlijk.
          </p>
        </div>

        {/* Informatie + FAQ */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Contactgegevens</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">E-mail</p>
                  <p className="text-slate-600 dark:text-slate-400">info@auto-theorie.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Locatie</p>
                  <p className="text-slate-600 dark:text-slate-400">Zuid-Holland, Nederland</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Reactietijd</p>
                  <p className="text-slate-600 dark:text-slate-400">Meestal binnen 24 uur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Veelgestelde Vragen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Kan ik gratis starten?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ja. Je kunt direct starten met een selectie lessen en voorbeeldvragen.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Wanneer moet ik inloggen?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Inloggen is pas nodig wanneer je een pakket kiest. Dan bewaren we je voortgang.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Zijn de vragen actueel?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ja. De vragen zijn gebaseerd op de meest recente CBR-richtlijnen en worden regelmatig bijgewerkt.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Welke categorieën kan ik oefenen?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Auto (B).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  )
}

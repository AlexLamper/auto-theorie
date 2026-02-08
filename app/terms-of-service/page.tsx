import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, AlertTriangle, Scale } from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"
export const metadata: Metadata = {
  title: "Algemene Voorwaarden - Auto Theorie",
  description: "Lees onze algemene voorwaarden voor het gebruik van Auto Theorie platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-6">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Algemene Voorwaarden</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Deze voorwaarden zijn van toepassing op het gebruik van Auto Theorie.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">Laatst bijgewerkt: 1 januari 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>1. Inleiding en Toepasselijkheid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Welkom bij Auto Theorie. Deze algemene voorwaarden ("Voorwaarden") zijn van toepassing op je gebruik
                van onze website, diensten en alle gerelateerde functionaliteiten (samen "Diensten").
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Door gebruik te maken van onze Diensten, ga je akkoord met deze Voorwaarden. Als je niet akkoord gaat
                met deze voorwaarden, mag je onze Diensten niet gebruiken.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Let op:</strong> Deze voorwaarden kunnen van tijd tot tijd worden gewijzigd. Controleer
                  regelmatig voor updates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Use of Service */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>2. Gebruik van de Dienst</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Je mag onze Diensten alleen gebruiken voor persoonlijke, niet-commerciële doeleinden (het oefenen voor
                je theorie-examen).
              </p>
              <p>Het is niet toegestaan om:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>De Diensten te gebruiken voor illegale doeleinden.</li>
                <li>De beveiliging van de Diensten te omzeilen of te verstoren.</li>
                <li>Inhoud van de website te kopiëren, te verspreiden of te verkopen zonder onze toestemming.</li>
                <li>Geautomatiseerde systemen (bots) te gebruiken om toegang te krijgen tot de Diensten.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>3. Intellectueel Eigendom</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Alle inhoud op Auto Theorie, inclusief maar niet beperkt tot tekst, afbeeldingen, logo's, vragen en
                software, is eigendom van Auto Theorie of haar licentiegevers en wordt beschermd door auteursrecht en
                andere intellectuele eigendomsrechten.
              </p>
              <p>
                Je krijgt een beperkte, niet-exclusieve, niet-overdraagbare licentie om de inhoud te bekijken en te
                gebruiken voor je eigen persoonlijke studie.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>4. Aansprakelijkheid en Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Hoewel we ons best doen om ervoor te zorgen dat de informatie op Auto Theorie accuraat en actueel is,
                geven we geen garanties over de volledigheid of juistheid ervan. De examenvragen zijn bedoeld als
                oefenmateriaal en kunnen afwijken van het officiële CBR-examen.
              </p>
              <p>
                Auto Theorie is niet aansprakelijk voor enige schade die voortvloeit uit het gebruik van, of het niet
                kunnen gebruiken van, onze Diensten, of voor het zakken voor een officieel examen.
              </p>
            </CardContent>
          </Card>

          {/* Applicable Law */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>5. Toepasselijk Recht</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Op deze Voorwaarden is Nederlands recht van toepassing. Geschillen zullen worden voorgelegd aan de
                bevoegde rechter in Nederland.
              </p>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Database, Mail } from "lucide-react"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Beleid - Auto Theorie",
  description: "Lees ons privacy beleid en ontdek hoe wij omgaan met je persoonlijke gegevens op Auto Theorie.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12 flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">Privacy Beleid</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Wij respecteren je privacy en zijn transparant over hoe we omgaan met je gegevens.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Laatst bijgewerkt: 1 januari 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                <Eye className="h-5 w-5 text-blue-600" />
                <span>Inleiding</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Auto Theorie ("wij", "ons", "onze") respecteert je privacy en is toegewijd aan het beschermen van je
                persoonlijke gegevens. Dit privacy beleid legt uit hoe wij informatie verzamelen, gebruiken en
                beschermen wanneer je onze website en diensten gebruikt.
              </p>
              <p>
                Door gebruik te maken van onze diensten, stem je in met de verzameling en het gebruik van informatie in
                overeenstemming met dit beleid.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                <Database className="h-5 w-5 text-blue-600" />
                <span>Gegevensverzameling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-muted-foreground">
              <p>Wij verzamelen verschillende soorten informatie voor diverse doeleinden:</p>
              <ul>
                <li>
                  <strong>Persoonlijke gegevens:</strong> Wij verzamelen geen persoonlijke gegevens zoals naam, adres of
                  telefoonnummer, tenzij je deze vrijwillig verstrekt via ons contactformulier.
                </li>
                <li>
                  <strong>Gebruiksgegevens:</strong> Informatie over hoe de dienst wordt gebruikt, zoals je IP-adres,
                  browsertype, browserversie, de pagina's die je bezoekt, tijd en datum van je bezoek, en andere
                  diagnostische gegevens.
                </li>
                <li>
                  <strong>Cookies:</strong> Wij gebruiken cookies en soortgelijke volgtechnologieën om de activiteit op
                  onze dienst te volgen en bepaalde informatie te bewaren.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Use of Data */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span>Gebruik van Gegevens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-muted-foreground">
              <p>Auto Theorie gebruikt de verzamelde gegevens voor verschillende doeleinden:</p>
              <ul>
                <li>Om de dienst te leveren en te onderhouden</li>
                <li>Om je op de hoogte te stellen van wijzigingen in onze dienst</li>
                <li>Om klantenondersteuning te bieden</li>
                <li>Om analyses of waardevolle informatie te verzamelen zodat we de dienst kunnen verbeteren</li>
                <li>Om technisch problemen te detecteren, te voorkomen en aan te pakken</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>Gegevensbeveiliging</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                De veiligheid van je gegevens is belangrijk voor ons, maar onthoud dat geen enkele methode van
                verzending via het internet of methode van elektronische opslag 100% veilig is. Hoewel we ernaar streven
                om commercieel aanvaardbare middelen te gebruiken om je persoonlijke gegevens te beschermen, kunnen we
                de absolute veiligheid ervan niet garanderen.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-muted-foreground">
              <p>
                Als je vragen hebt over dit privacy beleid, kun je contact met ons opnemen via e-mail:
                devlamper06@gmail.com
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

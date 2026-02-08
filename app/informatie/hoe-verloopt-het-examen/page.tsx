import InfoPageLayout from "@/components/informatie/InfoPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Info } from "lucide-react"

export default function HoeVerlooptHetExamenPage() {
  return (
    <InfoPageLayout
      title="Hoe verloopt het examen?"
      intro="Zo ziet het CBR theorie-examen er stap voor stap uit."
      breadcrumbCurrent="Hoe verloopt het examen?"
    >
      <>
        <Card className="mb-10 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100">
               <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
               Wat moet je scoren?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-slate-700 dark:text-slate-300">
                Het CBR theorie-examen voor de auto toetst kennis van verkeersregels en verkeersinzicht (per 7 april 2025). Deze kennis is noodzakelijk om op een veilige manier deel te nemen aan het verkeer in Nederland. Dit zijn de onderdelen:
             </p>
             <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-100 dark:border-slate-800">
                   <p className="font-bold text-slate-900 dark:text-white mb-1">Kennis</p>
                   <p className="text-xs text-slate-600 dark:text-slate-400">Dit zijn kennisvragen waar je laat zien dat je feiten en regels kunt herkennen en benoemen.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-100 dark:border-slate-800">
                   <p className="font-bold text-slate-900 dark:text-white mb-1">Inzicht</p>
                   <p className="text-xs text-slate-600 dark:text-slate-400">Totaal krijg je 50 vragen waarvan je er 44 goed moet beantwoorden.</p>
                </div>
             </div>
          </CardContent>
        </Card>

        <h2>Aankomst en inchecken</h2>
        <p>
          Meld je bij de balie en toon je identiteitsbewijs. Je wordt daarna naar de examenzaal begeleid.
        </p>
        <h2>Uitleg en start</h2>
        <p>
          Je krijgt een korte uitleg over het systeem en de regels. Daarna start het examen automatisch op je scherm.
        </p>
        <h2>De onderdelen</h2>
        <p>
          Het examen bestaat uit meerdere onderdelen. Je beantwoordt vragen over verkeersregels, inzicht en gevaarherkenning.
        </p>
        <h2>Uitslag</h2>
        <p>
          Na afloop zie je direct of je geslaagd of gezakt bent. Bij onvoldoende krijg je inzicht in welke onderdelen verbetering nodig hebben.
        </p>
      </>
    </InfoPageLayout>
  )
}

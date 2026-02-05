import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { getExams } from "@/lib/exams"

export default async function ExamsPage() {
  const exams = await getExams()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <section>
          <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Trophy className="h-4 w-4" />
              Proefexamens
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 tracking-tight">
              Auto Theorie Proefexamens
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Test je kennis met volledige proefexamens voor het B rijbewijs die identiek zijn aan het echte CBR theorie-examen.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-card py-4 px-8 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-2">
                <span className="text-foreground">{exams.length}</span> Oefenexamens
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-foreground">30 min</span> tijd
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
              <div className="flex items-center gap-2 text-green-600">
                €0 kosten
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.length > 0 ? (
              exams.map((exam: any) => (
                <Card key={exam.slug} className="border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Auto Theorie</span>
                       <span className="text-xs text-slate-400 font-bold"># {exam.exam_id}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                      {exam.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 font-bold">
                      <div>65 Vragen</div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div>30 Min</div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-all h-11 text-sm font-bold rounded-xl cursor-pointer"
                    >
                      <Link href={`/oefenexamens/start?slug=${exam.slug}`}>
                        Start Examen
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-card rounded-2xl border border-border shadow-sm">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-1">Geen examens gevonden</h3>
                <p className="text-muted-foreground font-medium">We zijn momenteel bezig met het toevoegen van nieuwe oefenexamens.</p>
              </div>
            )}
          </div>
        </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

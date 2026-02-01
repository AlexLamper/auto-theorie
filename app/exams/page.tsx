import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, CheckCircle, AlertCircle, Target, Users } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"

export default async function ExamsPage() {
  let exams = []
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/exams`, { cache: 'no-store' })
    const data = await res.json()
    // Sorteer numeriek op exam_id (1, 2, 3...)
    exams = (data.exams || []).sort((a: any, b: any) => (Number(a.exam_id) || 0) - (Number(b.exam_id) || 0))
  } catch (e) {
    console.error("Error fetching exams:", e)
    exams = []
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Auto Theorie Proefexamens</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
            Test je kennis met volledige proefexamens voor het B rijbewijs die identiek zijn aan het echte CBR theorie-examen.
          </p>

          {/* Key Stats - Compact Version */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500 uppercase tracking-widest bg-white py-4 px-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-slate-900">{exams.length}</span> Oefenexamens
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-slate-900">30 min</span> tijd
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2 text-green-600">
              €0 kosten
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.length > 0 ? (
              exams.map((exam: any) => (
                <Card key={exam.slug} className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Auto Theorie</span>
                       <span className="text-xs text-slate-400 font-bold"># {exam.exam_id}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {exam.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 font-bold">
                      <div>65 Vragen</div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div>30 Min</div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-all h-11 text-sm font-bold rounded-xl"
                    >
                      <Link href={`/exams/start?slug=${exam.slug}`}>
                        Start Examen
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Geen examens gevonden</h3>
                <p className="text-slate-500 font-medium">We zijn momenteel bezig met het toevoegen van nieuwe oefenexamens.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  )
}

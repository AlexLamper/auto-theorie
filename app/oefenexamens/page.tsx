import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"

export default async function ExamsPage() {
  let exams = []
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/oefenexamens`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text()
      console.error("Received non-JSON response:", text.substring(0, 100))
      throw new Error("Received non-JSON response from API")
    }
    const data = await res.json()
    // Robuuste numerieke sortering op exam_id
    exams = (data.exams || []).sort((a: any, b: any) => {
      const idA = parseInt(a.title.match(/\d+/)?.[0] || a.exam_id) || 0
      const idB = parseInt(b.title.match(/\d+/)?.[0] || b.exam_id) || 0
      return idA - idB
    })
  } catch (e) {
    console.error("Error fetching exams:", e)
    exams = []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Trophy className="h-4 w-4" />
              Proefexamens
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Auto Theorie Proefexamens
            </h1>
            <p className="text-lg text-slate-600 mt-4">
              Test je kennis met volledige proefexamens voor het B rijbewijs die identiek zijn aan het echte CBR theorie-examen.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white py-4 px-8 rounded-2xl shadow-sm border border-slate-100">
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
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
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Geen examens gevonden</h3>
                <p className="text-slate-500 font-medium">We zijn momenteel bezig met het toevoegen van nieuwe oefenexamens.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

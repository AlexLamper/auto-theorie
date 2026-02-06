import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { getExams } from "@/lib/exams"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findUserById } from "@/lib/user"
import { getExamLimit, hasActivePlan } from "@/lib/access"
import connectMongoDB from "@/libs/mongodb"
import UserExamAttempt from "@/models/UserExamAttempt"

export default async function ExamsPage() {
  const exams = await getExams()
  const session = await getServerSession(authOptions)
  const user = session?.user?.id ? await findUserById(session.user.id) : null
  const active = hasActivePlan(user?.plan)
  const examLimit = getExamLimit(user?.plan?.name, active)

  let attemptsUsed = 0
  if (session?.user?.id) {
    await connectMongoDB()
    const query: Record<string, any> = { userId: session.user.id }
    if (active && user?.plan?.startedAt && user?.plan?.expiresAt) {
      query.createdAt = {
        $gte: new Date(user.plan.startedAt),
        $lte: new Date(user.plan.expiresAt),
      }
    }
    attemptsUsed = await UserExamAttempt.countDocuments(query)
  }

  const isLockedAll = !session?.user?.id || attemptsUsed >= examLimit

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="flex-1">
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <Trophy className="h-4 w-4" />
                  Proefexamens
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Oefen zoals het echte CBR-examen
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Test je kennis met volledige proefexamens voor het B rijbewijs die identiek zijn aan het echte CBR theorie-examen.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{exams.length}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Examens</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">65</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Vragen</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">30 min</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Tijd</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className="text-sm font-semibold text-slate-700">Wat je kunt verwachten</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-600" /> Realistische CBR-stijl vragen</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-600" /> Direct inzicht in je score</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-600" /> Onbeperkt opnieuw oefenen</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {!session?.user?.id && (
              <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4 text-sm text-blue-700 font-medium">
                Log in om je gratis examen te starten en je voortgang te bewaren.
              </div>
            )}
            {session?.user?.id && (
              <div className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 font-medium">
                Pogingen gebruikt: {attemptsUsed} / {examLimit}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.length > 0 ? (
                exams.map((exam: any) => (
                  <Card key={exam.slug} className="border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
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
                      {isLockedAll ? (
                        <Button
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all h-11 text-sm font-bold rounded-xl cursor-pointer"
                        >
                          <Link href={session?.user?.id ? "/prijzen" : "/inloggen"}>
                            <span className="flex items-center justify-center gap-2">
                              <Lock className="h-4 w-4" />
                              {session?.user?.id ? "Premium nodig" : "Log in om te starten"}
                            </span>
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-all h-11 text-sm font-bold rounded-xl cursor-pointer"
                        >
                          <Link href={`/oefenexamens/start?slug=${exam.slug}`}>
                            Start Examen
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
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

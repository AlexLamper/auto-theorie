import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import connectMongoDB from "@/libs/mongodb"
import UserExamAttempt from "@/models/UserExamAttempt"
import UserProgress from "@/models/UserProgress"
import { getExams } from "@/lib/exams"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, GraduationCap, Play, Trophy, XCircle, BarChart3 } from "lucide-react"
import { RecentScoresChart } from "@/components/dashboard-chart"
import { FallbackImage } from "@/components/ui/fallback-image"

async function getDashboardData(userId: string) {
  await connectMongoDB()
  
  // Fetch stats concurrently
  const [examAttempts, completedLessonsCount, exams] = await Promise.all([
    UserExamAttempt.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
    UserProgress.countDocuments({ userId, completed: true }),
    getExams(),
  ])

  // Calculate stats
  const passedExams = examAttempts.filter((a: any) => a.passed).length
  const totalAttempts = examAttempts.length
  const averageScore = totalAttempts > 0 
    ? Math.round(examAttempts.reduce((acc: number, curr: any) => acc + ( (curr.score || 0) / 65 * 100), 0) / totalAttempts) 
    : 0

  return {
    examAttempts: JSON.parse(JSON.stringify(examAttempts)),
    stats: {
      passedExams,
      totalAttempts,
      averageScore,
      completedLessons: completedLessonsCount
    },
    exams
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/inloggen")
  }

  // Double check plan (middleware does this, but safe to have)
  const hasPlan = session.user.plan && new Date(session.user.plan.expiresAt) > new Date()
  if (!hasPlan) {
    redirect("/prijzen")
  }

  const { examAttempts, stats, exams } = await getDashboardData(session.user.id)
  const userPlan = session.user.plan!

  // Format expiry date
  const expiryDate = new Date(userPlan.expiresAt).toLocaleDateString("nl-NL", { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })
  
  // Calculate days left
  const daysLeft = Math.ceil((new Date(userPlan.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">
                 Welkom terug, {session.user.name?.split(' ')[0] || 'Student'}! 👋
               </h1>
               <p className="text-slate-400">
                 Je bent goed bezig. Vandaag is een mooie dag om te slagen.
               </p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm flex items-center gap-4">
               <div className="bg-blue-600/20 p-2.5 rounded-lg">
                 <GraduationCap className="text-blue-400 h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Huidig Pakket</p>
                  <div className="flex items-center gap-2">
                     <span className="font-bold">{userPlan.label || "Premium"}</span>
                     <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] h-5">
                        Actief
                     </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Nog {daysLeft} dagen • Tot {expiryDate}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
           <Card className="shadow-lg border-0 bg-white">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Voltooide Lessen</CardTitle>
               <BookOpen className="h-4 w-4 text-slate-400" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.completedLessons}</div>
               <p className="text-xs text-slate-400">Van de ~25 hoofdstukken</p>
             </CardContent>
           </Card>
           
           <Card className="shadow-lg border-0 bg-white">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Gemiddelde Score</CardTitle>
               <AwardIcon score={stats.averageScore} />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.averageScore}%</div>
               <Progress value={stats.averageScore} className="h-1.5 mt-2 bg-slate-100" indicatorClassName={stats.averageScore > 80 ? "bg-emerald-500" : "bg-blue-600"} />
             </CardContent>
           </Card>

           <Card className="shadow-lg border-0 bg-white">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Examens Gemaakt</CardTitle>
               <CheckCircle className="h-4 w-4 text-slate-400" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalAttempts}</div>
               <p className="text-xs text-slate-400">Oefening baart kunst</p>
             </CardContent>
           </Card>

           <Card className="shadow-lg border-0 bg-white">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Examens Geslaagd</CardTitle>
               <Trophy className="h-4 w-4 text-emerald-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-emerald-600">{stats.passedExams}</div>
               <p className="text-xs text-slate-400">Blijf oefenen voor 100%</p>
             </CardContent>
           </Card>
        </div>

        {/* Learning Paths */}
        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Left: Content */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Progress Chart */}
              {examAttempts.length > 0 && (
                  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                           <BarChart3 className="h-5 w-5 text-blue-600" />
                           Je voortgang
                        </h2>
                      </div>
                      <RecentScoresChart data={examAttempts} />
                  </section>
              )}

              {/* Oefenexamens Carousel */}
              <section>
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                       <GraduationCap className="h-5 w-5 text-blue-600" />
                       Oefenexamens
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700">
                      <Link href="/oefenexamens">Alles bekijken</Link>
                    </Button>
                 </div>
                 
                 <div className="w-full">
                   <Carousel
                      opts={{
                        align: "start",
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {exams.map((exam: any) => (
                           <CarouselItem key={exam.exam_id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                              <Link href={`/oefenexamens/start?slug=${exam.slug}`} className="group block h-full">
                                <div className="bg-white rounded-xl border border-slate-200 p-4 h-full hover:shadow-md transition-all hover:border-blue-300 group-hover:-translate-y-1">
                                   <div className="aspect-video rounded-lg bg-slate-100 mb-4 relative overflow-hidden">
                                      <FallbackImage 
                                        src={`/images/oefenexamens/exam-${((exam.exam_id - 1) % 3) + 1}.png`} 
                                        fallbackSrc="/images/exams/exam-default.jpg"
                                        alt={exam.title}
                                        className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <div className="bg-white/90 rounded-full p-2 backdrop-blur-sm shadow-sm">
                                            <Play className="fill-blue-600 text-blue-600 w-4 h-4 ml-0.5" />
                                         </div>
                                      </div>
                                   </div>
                                   <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                      {exam.title}
                                   </h3>
                                   <p className="text-xs text-slate-500 mt-1">
                                     65 Vragen • 45 Minuten
                                   </p>
                                </div>
                              </Link>
                           </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex -left-4" />
                      <CarouselNext className="hidden md:flex -right-4" />
                    </Carousel>
                 </div>
              </section>

              {/* Continue Learning */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <BookOpen size={180} />
                  </div>
                  <div className="relative z-10 max-w-lg">
                     <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-100">Theorie Cursus</Badge>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Master de theorie</h2>
                     <p className="text-slate-600 mb-6">
                        Bereid je voor met onze complete theoriecursus. Van verkeersregels tot inzicht.
                        Leer op je eigen tempo.
                     </p>
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white pl-6 pr-6 shadow-lg shadow-blue-200" size="lg" asChild>
                        <Link href="/leren">
                           <Play className="w-4 h-4 mr-2 fill-current" />
                           Verder met leren
                        </Link>
                     </Button>
                  </div>
              </section>

           </div>

           {/* Right: Sidebar Activity */}
           <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                    Recente Resultaten
                 </h3>
                 
                 {examAttempts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                       <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-5 h-5 opacity-50" />
                       </div>
                       Nog geen examens gemaakt
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {examAttempts.map((attempt: any, i: number) => (
                          <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${attempt.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                   {attempt.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700 line-clamp-1">{attempt.examSlug || 'Oefenexamen'}</p>
                                   <p className="text-[10px] text-slate-400">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <span className={`text-sm font-bold ${attempt.passed ? 'text-emerald-600' : 'text-slate-600'}`}>
                                {(attempt.score / 65 * 10).toFixed(1)}
                             </span>
                          </div>
                       ))}
                    </div>
                 )}
                 
                 <Button variant="outline" className="w-full mt-4 text-xs h-8" asChild>
                    <Link href="/account">Bekijk historie</Link>
                 </Button>
              </div>

              {/* Promotion / Tip */}
              <div className="bg-blue-600 text-white rounded-xl p-5 shadow-lg shadow-blue-200">
                 <h3 className="font-bold mb-2 text-lg">Wist je dat? 💡</h3>
                 <p className="text-blue-100 text-sm mb-4">
                    De meeste leerlingen slagen sneller als ze elke dag 1 hoofdstuk en 1 examen doen.
                 </p>
                 <Link href="/tips" className="text-xs font-bold underline decoration-blue-400 underline-offset-4 hover:text-white">
                    Bekijk meer tips
                 </Link>
              </div>
           </div>

        </div>
      </div>
    </div>
  )
}

function AwardIcon({ score }: { score: number }) {
  if (score >= 80) return <Trophy className="h-4 w-4 text-emerald-500" />
  return <Trophy className="h-4 w-4 text-slate-300" />
}

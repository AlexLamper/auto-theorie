import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import connectMongoDB from "@/libs/mongodb"
import UserExamAttempt from "@/models/UserExamAttempt"
import UserProgress from "@/models/UserProgress"
import Lesson from "@/models/Lesson"
import { getExams } from "@/lib/exams"
import { updateAndGetStreak } from "@/lib/user"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, GraduationCap, ArrowRight, Trophy, XCircle, BarChart3, Flame } from "lucide-react"
import { RecentScoresChart } from "@/components/dashboard-chart"
import { FallbackImage } from "@/components/ui/fallback-image"

function AwardIcon({ score }: { score: number }) {
  if (score >= 80) return <Trophy className="h-4 w-4 text-emerald-500" />
  return <Trophy className="h-4 w-4 text-slate-400" />
}

async function getDashboardData(userId: string) {
  await connectMongoDB()
  
  // Fetch stats concurrently
  const [examAttempts, completedLessonsCount, exams, streak, categories] = await Promise.all([
    UserExamAttempt.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
    UserProgress.countDocuments({ userId, completed: true }),
    getExams(),
    updateAndGetStreak(userId),
    Lesson.aggregate([
      { $sort: { categoryOrder: 1, order: 1 } },
      {
        $group: {
          _id: "$category",
          title: { $first: "$categoryTitle" },
          order: { $first: "$categoryOrder" },
          image: { $first: "$image" }
        },
      },
      {
        $project: {
          _id: 0,
          slug: "$_id",
          title: 1,
          order: 1,
          image: 1
        },
      },
      { $sort: { order: 1, title: 1 } },
    ])
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
      completedLessons: completedLessonsCount,
      streak
    },
    exams,
    categories
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

  const { examAttempts, stats, exams, categories } = await getDashboardData(session.user.id)
  const userPlan = session.user.plan!

  // Format expiry date
  const expiryDate = new Date(userPlan.expiresAt).toLocaleDateString("nl-NL", { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })
  
  // Calculate days left
  const daysLeft = Math.ceil((new Date(userPlan.expiresAt).getTime() - new Date().getTime()) / 86400000)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                 Welkom terug, {session.user.name?.split(' ')[0] || 'Student'}! 👋
               </h1>
               <p className="text-slate-400">
                 Je bent goed bezig. Vandaag is een mooie dag om te slagen.
               </p>
            </div>
            
            <div className="bg-slate-700/40 p-4 rounded-xl border border-slate-600/50 backdrop-blur-sm flex items-center gap-4 shadow-xl shadow-black/20">
               <div className="bg-blue-600/30 p-2.5 rounded-lg border border-blue-500/20">
                 <GraduationCap className="text-blue-400 h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Huidig Pakket</p>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-white tracking-tight">{userPlan.label || "Premium"}</span>
                     <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] h-5 font-bold">
                        Actief
                     </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{daysLeft} dagen over • Tot {expiryDate}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
           <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow hover:cursor-default">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Voltooide Lessen</CardTitle>
               <BookOpen className="h-4 w-4 text-slate-400" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-slate-950 dark:text-white mb-2">{stats.completedLessons}</div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-medium text-slate-500">
                    <span>Hoofdstuk {Math.min(stats.completedLessons + 1, 13)}/13</span>
                    <span>{Math.round((stats.completedLessons / 13) * 100)}%</span>
                  </div>
                  <Progress value={(stats.completedLessons / 13) * 100} className="h-1 bg-slate-100 dark:bg-slate-800" />
               </div>
             </CardContent>
           </Card>
           
           <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow hover:cursor-default">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Gemiddelde Score</CardTitle>
               <AwardIcon score={stats.averageScore} />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-slate-950 dark:text-white">{stats.averageScore}%</div>
               <Progress value={stats.averageScore} className="h-1.5 mt-2 bg-slate-100 dark:bg-slate-800" indicatorClassName={stats.averageScore > 80 ? "bg-emerald-500" : "bg-blue-600"} />
             </CardContent>
           </Card>

           <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow hover:cursor-default">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Examens Gemaakt</CardTitle>
               <CheckCircle className="h-4 w-4 text-slate-400" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-slate-950 dark:text-white mb-2">{stats.totalAttempts}</div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-medium text-slate-500">
                    <span>Examen {stats.totalAttempts}/10</span>
                    <span>{Math.min(Math.round((stats.totalAttempts / 10) * 100), 100)}%</span>
                  </div>
                  <Progress value={(stats.totalAttempts / 10) * 100} className="h-1 bg-slate-100 dark:bg-slate-800" />
               </div>
             </CardContent>
           </Card>

           <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow hover:cursor-default">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Examens Geslaagd</CardTitle>
               <Trophy className="h-4 w-4 text-emerald-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-emerald-700">{stats.passedExams}</div>
               <p className="text-xs text-slate-400 dark:text-slate-500">Blijf oefenen voor 100%</p>
             </CardContent>
           </Card>
        </div>

        {/* Learning Paths */}
        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Left: Content */}
           <div className="lg:col-span-2 space-y-12">
              
              {/* Progress Chart */}
              {examAttempts.length > 0 && (
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                       <GraduationCap className="h-5 w-5 text-blue-600" />
                       Oefenexamens
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:cursor-pointer transition-colors">
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
                              <Link href={`/oefenexamens/start?slug=${exam.slug}`} className="group block h-full hover:cursor-pointer">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-full hover:shadow-lg transition-all hover:border-blue-400 group-hover:-translate-y-1 overflow-hidden flex flex-col">
                                   <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden w-full m-0 p-0">
                                      <FallbackImage 
                                        src={`/images/oefenexamens/exam-${((exam.exam_id - 1) % 3) + 1}.png`} 
                                        fallbackSrc="/images/exams/exam-default.jpg"
                                        alt={exam.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <div className="bg-blue-600/90 rounded-full p-2.5 backdrop-blur-sm shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                         </div>
                                      </div>
                                   </div>
                                   <div className="p-4 flex flex-col flex-1">
                                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                                         {exam.title}
                                      </h3>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        65 Vragen • 45 Minuten
                                      </p>
                                   </div>
                                </div>
                              </Link>
                           </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex -left-4 bg-white/95 dark:bg-slate-800 opacity-100 shadow-lg border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white hover:cursor-pointer" />
                      <CarouselNext className="hidden md:flex -right-4 bg-white/95 dark:bg-slate-800 opacity-100 shadow-lg border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white hover:cursor-pointer" />
                    </Carousel>
                 </div>
              </section>

              {/* Theory Cursus Section */}
              <section className="space-y-6">
                 <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
                        <BookOpen size={120} className="text-slate-900 dark:text-white" />
                     </div>
                     <div className="relative z-10 max-w-lg">
                        <Badge variant="secondary" className="mb-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">Theorie Cursus</Badge>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Master de theorie</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                           Bereid je voor met onze complete theoriecursus. Van verkeersregels tot inzicht.
                           Leer op je eigen tempo.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white pl-6 pr-6 shadow-lg shadow-blue-200 dark:shadow-none hover:cursor-pointer transition-all hover:translate-x-1" size="lg" asChild>
                           <Link href="/leren">
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Verder met leren
                           </Link>
                        </Button>
                     </div>
                 </div>

                 {/* Theory Carousel */}
                 <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          Theorie Hoofdstukken
                       </h3>
                    </div>
                    
                    <Carousel
                       opts={{
                         align: "start",
                       }}
                       className="w-full"
                     >
                       <CarouselContent className="-ml-2 md:-ml-4">
                         {categories.map((category: any, i: number) => (
                            <CarouselItem key={category.slug} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                               <Link href={`/leren/${category.slug}`} className="group block h-full hover:cursor-pointer">
                                 <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-full hover:shadow-lg transition-all hover:border-blue-400 group-hover:-translate-y-1 overflow-hidden flex flex-col">
                                    <div className="aspect-video bg-slate-50 dark:bg-slate-800 relative overflow-hidden w-full m-0 p-0">
                                       <FallbackImage 
                                         src={category.image || `/images/leren-covers/${category.slug.replace(/-/g, '_')}.png`} 
                                         fallbackSrc="/images/exams/exam-default.jpg"
                                         alt={category.title}
                                         fill
                                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                         className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                       />
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                       <div className="absolute bottom-3 left-3 right-3 text-white">
                                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Hoofdstuk {i + 1}</p>
                                          <h4 className="font-bold text-sm line-clamp-1">{category.title}</h4>
                                       </div>
                                    </div>
                                    <div className="p-3 flex items-center justify-between">
                                       <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Starten</span>
                                       <div className="bg-blue-50 dark:bg-slate-800 p-1.5 rounded-full group-hover:bg-blue-600 transition-colors">
                                          <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                       </div>
                                    </div>
                                 </div>
                               </Link>
                            </CarouselItem>
                         ))}
                       </CarouselContent>
                       <CarouselPrevious className="hidden md:flex -left-4 bg-white/95 dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700 hover:cursor-pointer" />
                       <CarouselNext className="hidden md:flex -right-4 bg-white/95 dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700 hover:cursor-pointer" />
                     </Carousel>
                 </div>
              </section>

           </div>

           {/* Right: Sidebar Activity */}
           <div className="space-y-6">
              {/* Streak Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm overflow-hidden relative">
                 <div className="absolute -top-2 -right-2 p-3 opacity-10">
                    <Flame size={80} className="text-orange-500" />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Jouw Progressie</p>
                    <div className="flex items-center gap-3">
                       <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-900/30">
                          <Flame className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                       </div>
                       <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{stats.streak} {stats.streak === 1 ? 'Dag' : 'Dagen'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Study Streak</p>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Je bent al <strong>{stats.streak} {stats.streak === 1 ? 'dag' : 'dagen'}</strong> op dreef. Blijf elke dag oefenen om je kennis op peil te houden!
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                    Recente Resultaten
                 </h3>
                 
                 {examAttempts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                       <div className="bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-5 h-5 opacity-50" />
                       </div>
                       Nog geen examens gemaakt
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {examAttempts.map((attempt: any, i: number) => (
                          <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${attempt.passed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                                   {attempt.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{attempt.examSlug || 'Oefenexamen'}</p>
                                   <p className="text-[10px] text-slate-400">{new Date(attempt.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <span className={`text-sm font-bold ${attempt.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                {(attempt.score / 65 * 10).toFixed(1)}
                             </span>
                          </div>
                       ))}
                    </div>
                 )}
                 
                 <Button variant="outline" className="w-full mt-4 text-xs h-8 hover:cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700 transition-colors" asChild>
                    <Link href="/account">Bekijk historie</Link>
                 </Button>
              </div>

              {/* Promotion / Tip */}
              <div className="bg-blue-600 text-white rounded-xl p-5 shadow-lg shadow-blue-200 dark:shadow-none group relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={100} />
                 </div>
                 <h3 className="font-bold mb-2 text-lg relative z-10">Wist je dat? 💡</h3>
                 <p className="text-blue-100 text-sm mb-4 relative z-10">
                    De meeste leerlingen slagen sneller als ze elke dag 1 hoofdstuk en 1 examen doen.
                 </p>
                 <Link href="/informatie/theorie-examen-tips" className="text-xs font-bold underline decoration-blue-400 underline-offset-4 hover:text-white hover:cursor-pointer relative z-10">
                    Bekijk meer tips
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

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
import { FallbackImage } from "@/components/ui/fallback-image"

export default async function ExamsPage() {
  const exams = await getExams()
  const session = await getServerSession(authOptions)
  const user = session?.user?.id ? await findUserById(session.user.id) : null
  const active = hasActivePlan(user?.plan)
  const examLimit = getExamLimit(user?.plan?.name, active, user?.examLimit || 0)

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

  const cardTones = [
    "bg-gradient-to-br from-sky-500/20 to-sky-100",
    "bg-gradient-to-br from-emerald-500/20 to-emerald-100",
    "bg-gradient-to-br from-indigo-500/20 to-indigo-100",
    "bg-gradient-to-br from-amber-500/20 to-amber-100",
    "bg-gradient-to-br from-rose-500/20 to-rose-100",
    "bg-gradient-to-br from-slate-500/15 to-slate-100",
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
               <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    Oefenexamens
                  </h1>
                  <p className="text-slate-400 max-w-2xl text-lg mb-2">
                    Bereid je voor met realistische oefenexamens.
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    {!session?.user?.id ? (
                      <span className="text-slate-400">Log in voor statistieken</span>
                    ) : (
                      <span className="text-slate-400">
                        Pogingen: <span className="text-white font-bold">{attemptsUsed}</span> van <span className="text-white font-bold">{examLimit}</span>
                      </span>
                    )}
                  </div>
               </div>
            </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 max-w-7xl -mt-8 relative z-10 pb-20">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 mb-10 animate-fade-up animate-delay-1">
              <div className="flex items-center gap-8 text-sm font-medium h-full">
                 <button className="text-blue-600 border-b-2 border-blue-600 h-full px-1 font-bold flex items-center">
                   Alle examens
                 </button>
              </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up animate-delay-2">
              {exams.length > 0 ? (
                exams.map((exam: any, index: number) => {
                  // Locked if:
                  // 1. First exam (oefenexamen-auto-1) is ALWAYS available for everyone.
                  // 2. Others are locked if: No active plan OR attempt limit reached.
                  const isExamLocked = index === 0 ? false : (!active || attemptsUsed >= examLimit);

                  return (
                  <div key={exam.slug} className={`group relative ${isExamLocked ? "cursor-not-allowed opacity-75 grayscale" : ""}`}>
                     {/* Card as the visual element */}
                     <Link href={!isExamLocked ? `/oefenexamens/start?slug=${exam.slug}` : "/prijzen"} className={`block relative aspect-video rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${isExamLocked ? "" : "group-hover:shadow-md cursor-pointer"}`}>
                        {/* Background Image */}
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                           <FallbackImage 
                             src={`/images/oefenexamens/exam-${((Math.abs(Number(exam.exam_id) || 0) || 1) % 3) + 1}.png`} 
                             fallbackSrc="/images/leren-covers/verkeersregels_en_snelheid.png"
                             alt={exam.title}
                             fill
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                             className="object-cover"
                           />
                           {/* Overlay */}
                           <div className={`absolute inset-0 transition-colors ${isExamLocked ? "bg-black/60" : "bg-black/20 group-hover:bg-black/30"}`} />
                        </div>

                        {/* Top Right: Lock Icon */}
                        <div className="absolute top-3 right-3">
                           {isExamLocked ? (
                              <div className="bg-black/40 p-2 rounded-full backdrop-blur-md text-white border border-white/20 shadow-xl">
                                 <Lock className="h-4 w-4" />
                              </div>
                           ) : (
                              <div className="bg-green-500/20 p-1.5 rounded-full backdrop-blur-sm text-green-700">
                                 <span className="block w-2 h-2 rounded-full bg-green-500" />
                              </div>
                           )}
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                           {/* Optional Badge for first item - Only show if user doesn't have a plan yet */}
                           {index === 0 && !active && user?.examLimit === 0 && (
                             <span className="inline-block bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded mb-2 uppercase tracking-widest shadow-lg border border-emerald-400/50">
                               Gratis Demo
                             </span>
                           )}

                           {isExamLocked && (
                              <span className="inline-block bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide border border-slate-700">
                                Alleen Premium
                              </span>
                           )}
                           
                           {/* Title */}
                           <h3 className="text-white font-bold text-lg drop-shadow-sm line-clamp-1">
                             {exam.title}
                           </h3>
                           
                           {/* Hover Action / Progress */}
                           <div className="mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all overflow-hidden duration-300">
                             {!isExamLocked ? (
                               <div 
                                 className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white"
                               >
                                 <div className="bg-white/20 p-1 rounded-full">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                 </div>
                                 Start nu
                               </div>
                             ) : (
                               <span className="text-xs font-bold text-white/80 hover:text-white">
                                 Premium nodig
                               </span>
                             )}
                           </div>
                        </div>
                     </Link>

                     {/* Text Below Card */}
                     <div className="mt-2 px-1 flex justify-between items-start">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                           Examen {index + 1}
                        </span>
                        {/* Fake duration or stats */}
                        <span className="text-xs text-slate-400 font-mono">
                           30m
                        </span>
                     </div>
                  </div>
                )})
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                     <AlertCircle className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Geen examens gevonden</h3>
                </div>
              )}
            </div>
      </div>
      <Footer />
    </div>
  )
}

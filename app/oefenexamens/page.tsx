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

  const cardTones = [
    "bg-gradient-to-br from-sky-500/20 to-sky-100",
    "bg-gradient-to-br from-emerald-500/20 to-emerald-100",
    "bg-gradient-to-br from-indigo-500/20 to-indigo-100",
    "bg-gradient-to-br from-amber-500/20 to-amber-100",
    "bg-gradient-to-br from-rose-500/20 to-rose-100",
    "bg-gradient-to-br from-slate-500/15 to-slate-100",
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="flex-1">
        <section className="pt-8 pb-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header Section matching screenshot structure */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Oefenexamens
                  </h1>
                  {/* Keep only essential subtitles if needed, user said 'stats' */}
                  <div className="flex items-center gap-4 text-sm font-medium pt-2">
                    {/* User requested stats */}
                    {!session?.user?.id ? (
                      <span className="text-slate-500">Log in voor statistieken</span>
                    ) : (
                      <span className="text-slate-600">
                        Pogingen: <span className="text-slate-900 font-bold">{attemptsUsed}</span> van <span className="text-slate-900 font-bold">{examLimit}</span>
                      </span>
                    )}
                  </div>
               </div>

               {/* Right side navigation/toggle from screenshot */}
               <div className="flex items-center justify-between border-b border-slate-200 pb-2 md:pb-0 md:border-0">
                  <div className="flex items-center gap-6 text-sm font-medium">
                     <button className="text-slate-900 border-b-2 border-slate-900 pb-2 md:pb-0 px-1">
                       Alle examens
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {exams.length > 0 ? (
                exams.map((exam: any, index: number) => {
                  // Locked if:
                  // 1. Not the first exam AND user has no active plan (Content Lock)
                  // 2. User has reached their attempt limit (Usage Lock)
                  const isExamLocked = (!active && index !== 0) || (attemptsUsed >= examLimit);

                  return (
                  <div key={exam.slug} className="group relative">
                     {/* Card as the visual element */}
                     <Link href={!isExamLocked ? `/oefenexamens/start?slug=${exam.slug}` : "/prijzen"} className="block relative aspect-video rounded-lg overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md cursor-pointer">
                        {/* Background Image */}
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                           <FallbackImage 
                             src={`/images/oefenexamens/exam-${((exam.exam_id - 1) % 3) + 1}.png`} 
                             fallbackSrc="/images/exams/exam-default.jpg"
                             alt={exam.title}
                             className="object-cover w-full h-full"
                           />
                           {/* Overlay */}
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        </div>

                        {/* Top Right: Lock Icon */}
                        <div className="absolute top-3 right-3">
                           {isExamLocked ? (
                              <div className="bg-black/20 p-1.5 rounded-full backdrop-blur-sm text-white/90">
                                 <Lock className="h-3 w-3" />
                              </div>
                           ) : (
                              <div className="bg-green-500/20 p-1.5 rounded-full backdrop-blur-sm text-green-700">
                                 <span className="block w-2 h-2 rounded-full bg-green-500" />
                              </div>
                           )}
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pt-12">
                           {/* Optional Badge for first item */}
                           {index === 0 && (
                             <span className="inline-block bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide">
                               Probeer gratis
                             </span>
                           )}
                           
                           {/* Title */}
                           <h3 className="text-white font-bold text-lg drop-shadow-sm">
                             {exam.title}
                           </h3>
                           
                           {/* Hover Action / Progress */}
                           <div className="mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all overflow-hidden duration-300">
                             {!isExamLocked ? (
                               <div 
                                 className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white"
                               >
                                 <div className="bg-white/20 p-1 rounded-full">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
                        <span className="text-sm font-medium text-slate-500">
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
                  <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                     <AlertCircle className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Geen examens gevonden</h3>
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

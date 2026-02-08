"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ParkingCircle,
  TrafficCone,
  User,
  BookOpen,
  Car,
  Leaf,
  Shield,
  HelpCircle,
  Users,
  Route,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import LoadingSpinner from "@/components/LoadingSpinner"
import { FallbackImage } from "@/components/ui/fallback-image"

interface CategorieInfo {
  slug: string
  title: string
  order: number
}

export default function LerenStartPage() {
  const [categorieen, setCategorieen] = useState<CategorieInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [zoek, setZoek] = useState("")
  const [completedCategories, setCompletedCategories] = useState<string[]>([])
  const [lessonsSummary, setLessonsSummary] = useState({ total: 0, completed: 0 })

  const { data: session, status } = useSession()

  const categorieIconen: Record<string, React.ReactNode> = {
    "milieu": <Leaf className="h-6 w-6 text-green-600" />,
    "verkeersborden": <ParkingCircle className="h-6 w-6 text-red-600" />,
    "verkeersregels": <Route className="h-6 w-6 text-blue-500" />,
    "veiligheid": <Shield className="h-6 w-6 text-yellow-500" />,
    "voorrang": <User className="h-6 w-6 text-pink-600" />,
    "weggebruikers": <Users className="h-6 w-6 text-indigo-600" />,
    "voertuig": <Car className="h-6 w-6 text-orange-600" />,
    "verkeerswetten": <BookOpen className="h-6 w-6 text-gray-600" />,
    "verkeersregelaar": <TrafficCone className="h-6 w-6 text-red-500" />,
    "kruispunten": <TrafficCone className="h-6 w-6 text-teal-600" />,
    "default": <HelpCircle className="h-6 w-6 text-gray-500" />,
  }


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/leren?voertuig=auto`)
        if (res.ok) {
          const data = await res.json()
          const cats = data.map((cat: any) => ({
            slug: cat.slug,
            title: cat.title,
            order: cat.order || 0,
          }))
          setCategorieen(cats)
        } else {
          console.error("Fout bij laden van onderwerpen", await res.text())
        }
      } catch (err) {
        console.error("Fout tijdens ophalen:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchProgress() {
      if (status !== "authenticated") {
        setCompletedCategories([])
        setLessonsSummary({ total: 0, completed: 0 })
        return
      }

      try {
        const res = await fetch("/api/progress/lessons")
        if (!res.ok) return
        const data = await res.json()
        setCompletedCategories(data.completedCategories || [])
        setLessonsSummary({
          total: data.totalLessonsCount || 0,
          completed: data.completedLessonsCount || 0,
        })
      } catch (err) {
        console.error("Fout bij laden voortgang:", err)
      }
    }

    fetchProgress()
  }, [status])

  const filtered = useMemo(
    () =>
      categorieen.filter((c) =>
        c.title.toLowerCase().includes(zoek.toLowerCase())
      ),
    [categorieen, zoek]
  );

  const totalCount = categorieen.length;
  const progressPercent = lessonsSummary.total > 0
    ? Math.round((lessonsSummary.completed / lessonsSummary.total) * 100)
    : 0;

  const toneStyles: Record<string, { banner: string; iconBg: string; accent: string }> = {
    milieu: { banner: "bg-gradient-to-br from-emerald-200/40 to-emerald-50/20 dark:from-emerald-900/40 dark:to-emerald-900/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/50", accent: "text-emerald-700 dark:text-emerald-400" },
    verkeersborden: { banner: "bg-gradient-to-br from-rose-200/40 to-rose-50/20 dark:from-rose-900/40 dark:to-rose-900/20", iconBg: "bg-rose-100 dark:bg-rose-900/50", accent: "text-rose-700 dark:text-rose-400" },
    verkeersregels: { banner: "bg-gradient-to-br from-blue-200/40 to-blue-50/20 dark:from-blue-900/40 dark:to-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/50", accent: "text-blue-700 dark:text-blue-400" },
    veiligheid: { banner: "bg-gradient-to-br from-amber-200/40 to-amber-50/20 dark:from-amber-900/40 dark:to-amber-900/20", iconBg: "bg-amber-100 dark:bg-amber-900/50", accent: "text-amber-700 dark:text-amber-400" },
    voorrang: { banner: "bg-gradient-to-br from-pink-200/40 to-pink-50/20 dark:from-pink-900/40 dark:to-pink-900/20", iconBg: "bg-pink-100 dark:bg-pink-900/50", accent: "text-pink-700 dark:text-pink-400" },
    weggebruikers: { banner: "bg-gradient-to-br from-indigo-200/40 to-indigo-50/20 dark:from-indigo-900/40 dark:to-indigo-900/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/50", accent: "text-indigo-700 dark:text-indigo-400" },
    voertuig: { banner: "bg-gradient-to-br from-orange-200/40 to-orange-50/20 dark:from-orange-900/40 dark:to-orange-900/20", iconBg: "bg-orange-100 dark:bg-orange-900/50", accent: "text-orange-700 dark:text-orange-400" },
    verkeerswetten: { banner: "bg-gradient-to-br from-slate-200/40 to-slate-50/20 dark:from-slate-800/60 dark:to-slate-900/40", iconBg: "bg-slate-100 dark:bg-slate-800", accent: "text-slate-700 dark:text-slate-400" },
    default: { banner: "bg-gradient-to-br from-blue-100/40 to-slate-50/20 dark:from-blue-900/20 dark:to-slate-900/20", iconBg: "bg-slate-100 dark:bg-slate-800", accent: "text-slate-700 dark:text-slate-400" },
  }

  const hasPlan = !!(session?.user?.plan?.expiresAt && new Date(session.user.plan.expiresAt) > new Date())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Theorie Leren
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Werk in je eigen tempo door de theorie.
              </p>
            </div>

            <div className="flex items-center gap-6">
               {status === "authenticated" ? (
                <div className="flex flex-col items-end">
                  <div className="text-sm font-semibold text-slate-200">
                    {lessonsSummary.completed} van {lessonsSummary.total} lessen voltooid
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-400">{progressPercent}%</span>
                  </div>
                </div>
               ) : (
                 <div className="text-sm font-medium text-slate-400">
                   Log in voor voortgang
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 mb-12">
              <div className="flex items-center gap-8 text-sm font-medium h-full">
                <button className="text-blue-600 border-b-2 border-blue-600 h-full px-1 font-bold flex items-center">
                  Alle onderwerpen
                </button>
                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 h-full px-1 transition-colors flex items-center">
                  Nog niet bekeken
                </button>
              </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
               <LoadingSpinner className="h-12 w-12" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {filtered.map((cat, index) => {
                const iconKey = Object.keys(categorieen).find((k) =>
                   cat.slug.toLowerCase().includes(k)
                ) || "default"
                // const CatIcon = categorieIconen[iconKey] // Icon not used in new card design in the same way? Screenshot uses numbers.
                const tone = toneStyles[iconKey] || toneStyles.default
                const isCompleted = completedCategories.includes(cat.slug)
                const isLocked = !hasPlan && index !== 0

                // Map slugs to cover images
                const coverImage = `/images/leren-covers/${cat.slug.replace(/-/g, '_')}.png`

                return (
                  <div key={cat.slug} className="group">
                    <Link href={`/leren/${cat.slug}`} className="block relative">
                       {/* Card Visual Area */}
                       <div className={`
                         relative aspect-video rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] shadow-sm
                         border border-slate-200/50 dark:border-slate-700/50
                       `}>
                          {/* Cover Image Background */}
                          <div className="absolute inset-0">
                             <FallbackImage 
                               src={coverImage}
                               fallbackSrc="/images/exams/exam-default.jpg"
                               alt={cat.title}
                               className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                             />
                             {/* Overlay Gradient for readability */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                          </div>
                          
                          {/* Top Row */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                             <span className="text-xs font-mono font-bold text-white opacity-90">
                               {cat.order.toString().padStart(2, "0")}
                             </span>
                             {/* Lock or Status Icon */}
                             {isLocked ? (
                               <div className="bg-black/40 p-1.5 rounded-full backdrop-blur-md border border-white/10">
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                               </div>
                             ) : isCompleted ? (
                               <div className="bg-green-500/40 p-1.5 rounded-full backdrop-blur-md border border-green-400/20 text-green-300">
                                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                               </div>
                             ) : null}
                          </div>

                          {/* Content Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 z-10">
                             {/* Only show "Start hier" if NOT premium/authenticated with plan? */}
                             {index === 0 && (!session?.user?.plan) && (
                                <span className="inline-block bg-yellow-400 text-yellow-900 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mb-2 shadow-sm">
                                  Start hier
                                </span>
                             )}
                             <h3 className="text-lg font-bold text-white leading-tight mb-3 drop-shadow-md">
                               {cat.title}
                             </h3>
                             
                             {/* Progress/Duration Line */}
                             <div className="flex items-center gap-3">
                               <button className="bg-white text-slate-900 rounded-full p-1.5 hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                                 <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                               </button>
                               <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                  <div className={`h-full bg-white/70 w-0 group-hover:w-full transition-all duration-700`} />
                               </div>
                               <span className="text-[10px] font-mono font-bold text-white/90">
                                 ~15m
                               </span>
                             </div>
                          </div>
                       </div>
                    </Link>

                    {/* Description Outside Card */}
                    <div className="mt-3 px-1">
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {/* Placeholder text logic based on category, or generic description */}
                        Leer alles over {cat.title.toLowerCase()} en bereid je voor op het theorie-examen.
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

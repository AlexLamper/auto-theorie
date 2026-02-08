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
  ArrowRight,
  Lock,
  CheckCircle,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((cat, index) => {
                const isCompleted = completedCategories.includes(cat.slug)
                const isLocked = !hasPlan && index !== 0
                const coverImage = `/images/leren-covers/${cat.slug.replace(/-/g, '_')}.png`

                return (
                  <Link 
                    key={cat.slug} 
                    href={isLocked ? "/prijzen" : `/leren/${cat.slug}`}
                    className={`group ${isLocked ? "cursor-pointer" : ""}`}
                  >
                    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col ${isLocked ? "grayscale opacity-75" : "group-hover:-translate-y-1"}`}>
                       {/* Card Image Area */}
                       <div className="aspect-video relative overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <FallbackImage 
                             src={coverImage}
                             fallbackSrc="/images/exams/exam-default.jpg"
                             alt={cat.title}
                             fill
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                             className={`object-cover opacity-90 group-hover:opacity-100 transition-opacity ${isLocked ? "grayscale" : "grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105"} duration-500`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                          
                          {/* Top Row: Chapter Info & Status */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                             <div className="bg-black/30 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Hoofdstuk {cat.order}</p>
                             </div>
                             {isLocked ? (
                               <div className="bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/20 text-white shadow-xl">
                                  <Lock className="w-4 h-4" />
                               </div>
                             ) : isCompleted ? (
                               <div className="bg-green-500/80 p-1.5 rounded-full backdrop-blur-md border border-green-400 text-white shadow-sm">
                                 <CheckCircle className="w-3.5 h-3.5" />
                               </div>
                             ) : null}
                          </div>

                          {/* Title inside image */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                             <h4 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-blue-200 transition-colors">{cat.title}</h4>
                             {index === 0 && (!hasPlan) && (
                                <span className="inline-block bg-blue-500 text-white text-[9px] uppercase px-2 py-0.5 rounded mt-2 shadow-lg font-black tracking-widest border border-blue-400/50">
                                   3 Proef lessen
                                </span>
                             )}
                          </div>
                       </div>

                       {/* Card Footer */}
                       <div className="p-4 flex items-center justify-between mt-auto">
                          <div className="flex flex-col gap-0.5">
                             <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                               {isLocked ? "Alleen Premium" : "Beginnen"}
                             </span>
                             <div className="flex items-center gap-1.5">
                                <div className={`h-1.5 w-1.5 rounded-full ${isLocked ? "bg-slate-300" : "bg-blue-500"}`} />
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">~15 Minuten</span>
                             </div>
                          </div>
                          {isLocked ? (
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-400">
                               <Lock className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="bg-blue-50 dark:bg-slate-800 p-2 rounded-full group-hover:bg-blue-600 transition-all text-blue-600 dark:text-blue-400 group-hover:text-white shadow-sm">
                               <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                       </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

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

  const { status } = useSession()

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
    milieu: { banner: "bg-gradient-to-br from-emerald-100 to-emerald-50", iconBg: "bg-emerald-100", accent: "text-emerald-700" },
    verkeersborden: { banner: "bg-gradient-to-br from-rose-100 to-rose-50", iconBg: "bg-rose-100", accent: "text-rose-700" },
    verkeersregels: { banner: "bg-gradient-to-br from-blue-100 to-blue-50", iconBg: "bg-blue-100", accent: "text-blue-700" },
    veiligheid: { banner: "bg-gradient-to-br from-amber-100 to-amber-50", iconBg: "bg-amber-100", accent: "text-amber-700" },
    voorrang: { banner: "bg-gradient-to-br from-pink-100 to-pink-50", iconBg: "bg-pink-100", accent: "text-pink-700" },
    weggebruikers: { banner: "bg-gradient-to-br from-indigo-100 to-indigo-50", iconBg: "bg-indigo-100", accent: "text-indigo-700" },
    voertuig: { banner: "bg-gradient-to-br from-orange-100 to-orange-50", iconBg: "bg-orange-100", accent: "text-orange-700" },
    verkeerswetten: { banner: "bg-gradient-to-br from-slate-100 to-slate-50", iconBg: "bg-slate-100", accent: "text-slate-700" },
    default: { banner: "bg-gradient-to-br from-slate-100 to-white", iconBg: "bg-slate-100", accent: "text-slate-700" },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Theorie Leren
              </h1>
              <p className="text-lg text-slate-500">
                Werk in je eigen tempo door de theorie.
              </p>
            </div>

            <div className="flex items-center gap-6">
               {status === "authenticated" ? (
                <div className="flex flex-col items-end">
                   <div className="text-sm font-semibold text-slate-900">
                     {lessonsSummary.completed} van {lessonsSummary.total} lessen voltooid
                   </div>
                   <div className="flex items-center gap-3 mt-1">
                     <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-600 rounded-full" 
                         style={{ width: `${progressPercent}%` }}
                       />
                     </div>
                     <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
                   </div>
                </div>
               ) : (
                 <div className="text-sm font-medium text-slate-500">
                   Log in voor voortgang
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
             <div className="flex items-center gap-6 text-sm font-medium">
                <button className="text-slate-900 border-b-2 border-slate-900 pb-4 -mb-4 px-1">
                  Alle onderwerpen
                </button>
                <button className="text-slate-500 hover:text-slate-700 pb-4 -mb-4 px-1">
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

                return (
                  <div key={cat.slug} className="group">
                    <Link href={`/leren/${cat.slug}`} className="block relative">
                       {/* Card Visual Area */}
                       <div className={`
                         relative aspect-video rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] shadow-sm
                         ${tone.banner}
                       `}>
                          {/* Overlay Gradient for consistency if needed, but tone.banner handles it */}
                          
                          {/* Top Row */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                             <span className="text-xs font-mono opacity-60 font-semibold text-slate-900">
                               {cat.order.toString().padStart(2, "0")}
                             </span>
                             {/* Lock or Status Icon */}
                             {!isCompleted ? (
                               <div className="bg-black/10 p-1 rounded-full backdrop-blur-sm">
                                  {/* Using a subtle lock or styling for non-completed implies 'todo' */}
                                  <svg className="w-3 h-3 text-slate-900/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                               </div>
                             ) : (
                               <div className="bg-green-500/20 p-1 rounded-full backdrop-blur-sm text-green-700">
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                               </div>
                             )}
                          </div>

                          {/* Content Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/10 to-transparent">
                             {index === 0 && (
                                <span className="inline-block bg-yellow-400 text-yellow-900 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mb-2">
                                  Start hier
                                </span>
                             )}
                             <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                               {cat.title}
                             </h3>
                             
                             {/* Progress/Duration Line */}
                             <div className="flex items-center gap-3">
                               <button className="bg-slate-900 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors">
                                 <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                               </button>
                               <div className="flex-1 h-1 bg-slate-900/10 rounded-full overflow-hidden">
                                  <div className={`h-full bg-slate-900/50 w-0 group-hover:w-full transition-all duration-700`} />
                               </div>
                               <span className="text-[10px] font-mono font-medium text-slate-700">
                                 {/* Mock duration or lesson count */}
                                 ~15m
                               </span>
                             </div>
                          </div>
                       </div>
                    </Link>

                    {/* Description Outside Card */}
                    <div className="mt-3 px-1">
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
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
      </section>
    </div>
  )
}

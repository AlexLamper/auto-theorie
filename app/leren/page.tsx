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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-blue-50/30" />
        <div className="container mx-auto px-4 py-16 max-w-6xl relative">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-500 hover:text-blue-600">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium">Auto Theorie Leren</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Car className="h-4 w-4" />
                Leerpad Auto Theorie
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Leren met structuur, oefenen met focus
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Kies een onderwerp en werk stap voor stap toe naar je examen. Alles is opgebouwd volgens de nieuwste CBR-richtlijnen.
              </p>
              {status !== "authenticated" && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 font-medium">
                  Log in om je voortgang op te slaan en later verder te gaan.
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Onderwerpen</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{lessonsSummary.completed}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Lessen voltooid</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{progressPercent}%</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Voortgang</p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className="text-sm font-semibold text-slate-700">Zoek een onderwerp</div>
                <p className="text-xs text-slate-500 mt-1">Filter direct op de les die je wilt volgen.</p>
                <Input
                  type="text"
                  placeholder="Zoek onderwerp..."
                  value={zoek}
                  onChange={(e) => setZoek(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner className="h-12 w-12" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => {
              const iconKey = Object.keys(categorieIconen).find((k) =>
                cat.slug.toLowerCase().includes(k)
              ) || "default"
              const CatIcon = categorieIconen[iconKey]
              const isCompleted = completedCategories.includes(cat.slug)

              return (
                <Link
                  key={cat.slug}
                  href={`/leren/${cat.slug}`}
                  className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                      {CatIcon}
                    </div>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Voltooid
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h2>

                  <div className="mt-auto pt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-blue-600">
                    Onderwerp starten
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

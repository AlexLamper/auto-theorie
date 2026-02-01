"use client"

import { JSX, useEffect, useMemo, useState } from "react"
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
  TrafficConeIcon,
} from "lucide-react"
import { getVoortgang } from "@/lib/session"
import { Input } from "@/components/ui/input"

const categorieIconen: Record<string, JSX.Element> = {
  "milieu": <Leaf className="h-6 w-6 text-green-600" />,
  "verkeersborden": <ParkingCircle className="h-6 w-6 text-red-600" />,
  "verkeersregels": <Route className="h-6 w-6 text-blue-500" />,
  "veiligheid": <Shield className="h-6 w-6 text-yellow-500" />,
  "voorrang": <User className="h-6 w-6 text-pink-600" />,
  "weggebruikers": <Users className="h-6 w-6 text-indigo-600" />,
  "voertuig": <Car className="h-6 w-6 text-orange-600" />,
  "verkeerswetten": <BookOpen className="h-6 w-6 text-gray-600" />,
  "verkeersregelaar": <TrafficCone className="h-6 w-6 text-red-500" />,
  "kruispunten": <TrafficConeIcon className="h-6 w-6 text-teal-600" />,
  "default": <HelpCircle className="h-6 w-6 text-gray-500" />,
}

interface CategorieInfo {
  slug: string
  title: string
  order: number
}

export default function LerenStartPage() {
  const [categorieen, setCategorieen] = useState<CategorieInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [zoek, setZoek] = useState("")

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

  const filtered = useMemo(
    () =>
      categorieen.filter((c) =>
        c.title.toLowerCase().includes(zoek.toLowerCase())
      ),
    [categorieen, zoek]
  )

  const voortgang = getVoortgang()
  const gelezen = voortgang?.gelezen || {}

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumb className="mb-8">
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100`}>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Auto Theorie Leren
              </h1>
            </div>
            <p className="text-slate-600 text-lg ml-0 md:ml-[4.5rem]">
              Bereid je stap voor stap voor op het auto theorie-examen (B).
            </p>
          </div>

          <div className="w-full md:w-72">
            <Input
              type="text"
              placeholder="Zoek onderwerp..."
              value={zoek}
              onChange={(e) => setZoek(e.target.value)}
              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-xl shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => {
              const iconKey = Object.keys(categorieIconen).find((k) =>
                cat.slug.toLowerCase().includes(k)
              ) || "default"
              const CatIcon = categorieIconen[iconKey]
              const isCompleted = gelezen[cat.slug]

              return (
                <Link
                  key={cat.slug}
                  href={`/leren/${cat.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
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
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
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
      </div>
    </div>
  )
}

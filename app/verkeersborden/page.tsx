"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { Search } from "lucide-react"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/LoadingSpinner"
import DonationPrompt from "@/components/DonationPrompt"

interface TrafficSign {
  _id: string | { $oid: string }
  name: string
  description: string
  meaning: string
  category: string[] | string
  type: string
  shape: string
  color: string
  image: string
  applicableFor: string[]
  createdAt: string
  updatedAt: string
}

const createPlaceholderSVG = (width = 160, height = 160) => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 3}" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <text x="${width / 2}" y="${height / 2 + 5}" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">?</text>
    </svg>
  `
  if (typeof window !== "undefined") {
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
  return ""
}

export default function TrafficSignsPage() {
  const [signs, setSigns] = useState<TrafficSign[]>([])
  const [filteredSigns, setFilteredSigns] = useState<TrafficSign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  const signTypes = useMemo(() => [
    "waarschuwing", "snelheid", "voorrang", "informatie", "verbod", "rijrichting", "parkeren", "overig"
  ], [])

  const fetchSigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/traffic-signs")
      if (!res.ok) throw new Error(`Fout bij laden: ${res.status}`)
      const data = await res.json()
      const trafficSigns = data.trafficSigns || []
      setSigns(trafficSigns)
      setFilteredSigns(trafficSigns)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan bij het laden van de borden")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchSigns()
  }, [])

  useEffect(() => {
    let filtered = signs
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(lowerSearch) || 
        s.meaning.toLowerCase().includes(lowerSearch) ||
        s.description.toLowerCase().includes(lowerSearch)
      )
    }
    if (selectedType !== "all") {
      filtered = filtered.filter(s => {
        const type = s.type || (Array.isArray(s.category) ? s.category[0] : s.category)
        return type?.toLowerCase() === selectedType.toLowerCase()
      })
    }
    setFilteredSigns(filtered)
  }, [searchTerm, selectedType, signs])

  const typeCounts = useMemo(() => {
    return ["all", ...signTypes].map((type) => {
      const count = type === "all" 
        ? signs.length 
        : signs.filter((s) => {
            const signType = s.type || (Array.isArray(s.category) ? s.category[0] : s.category)
            return signType?.toLowerCase() === type.toLowerCase()
          }).length
      return {
        id: type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        count
      }
    })
  }, [signs, signTypes])

  const handleImageError = (signId: string) => {
    setImageErrors((prev) => new Set(prev).add(signId))
  }

  const getTypeColor = (type: string) => {
    const t = type?.toLowerCase()
    const colors: Record<string, string> = {
      gebod: "bg-blue-50 text-blue-700 border-blue-200",
      verbod: "bg-red-50 text-red-700 border-red-200",
      waarschuwing: "bg-yellow-50 text-yellow-700 border-yellow-200",
      voorrang: "bg-purple-50 text-purple-700 border-purple-200",
      informatie: "bg-green-50 text-green-700 border-green-200",
      snelheid: "bg-orange-50 text-orange-700 border-orange-200",
      rijrichting: "bg-indigo-50 text-indigo-700 border-indigo-200",
      parkeren: "bg-gray-50 text-gray-700 border-gray-200",
    }
    return colors[t] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getShapeIcon = (shape: string) => {
    const s = shape?.toLowerCase()
    const shapes: Record<string, string> = {
      rond: "⭕",
      driehoek: "🔺",
      vierkant: "⬜",
      achthoek: "🛑",
      ruit: "🔶",
    }
    return shapes[s] || "⬜"
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="flex-1">
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          <div className="container mx-auto px-4 py-16 max-w-7xl relative">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  Nederlandse verkeersborden
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Ken elk bord. Begrijp elke situatie.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                  Alle verkeersborden die je moet kennen voor je auto theorie-examen (B). Klik op de voorlees-knop om de betekenis te horen.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{signs.length}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Borden</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{typeCounts.filter(t => t.id !== "all" && t.count > 0).length}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">Categorieën</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className="text-sm font-semibold text-slate-700">Zoek verkeersborden</div>
                <p className="text-xs text-slate-500 mt-1">Filter op naam, betekenis of categorie.</p>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Zoek verkeersborden op naam of betekenis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 text-sm font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {typeCounts.filter(t => t.count > 0 || t.id === "all").map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        selectedType === type.id ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type.name} ({type.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 max-w-7xl">
          {error && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-6 flex items-center space-x-3">
                <div className="flex-1">
                  <h3 className="font-bold text-red-900">Fout bij laden</h3>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
                <Button onClick={fetchSigns} variant="outline" size="sm" className="bg-white border-red-200 font-bold">Opnieuw</Button>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600 animate-pulse font-medium">Borden laden...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-slate-500 font-bold">
                  {filteredSigns.length} van {signs.length} borden
                </div>
              </div>
              
              {filteredSigns.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Geen resultaten</h3>
                  <p className="text-slate-500 mb-6">Probeer een andere zoekterm of filter.</p>
                  <Button onClick={() => { setSearchTerm(""); setSelectedType("all") }} variant="outline">Filters wissen</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSigns.map((sign) => {
                    const signId = typeof sign._id === 'string' ? sign._id : sign._id?.$oid;
                    const displayType = sign.type || (Array.isArray(sign.category) ? sign.category[0] : sign.category);

                    return (
                      <Card key={signId} className="group bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-5">
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-4 flex items-center justify-center group-hover:bg-white transition-colors h-48">
                            <img
                              src={imageErrors.has(signId) ? createPlaceholderSVG(160, 160) : sign.image}
                              alt={sign.name}
                              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                              onError={() => handleImageError(signId)}
                              loading="lazy"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">{sign.name}</h3>
                              <span className="text-lg ml-2">{getShapeIcon(sign.shape)}</span>
                            </div>
                            <Badge className={`${getTypeColor(displayType)} border text-[10px] uppercase font-bold px-2 py-0.5`} variant="outline">{displayType}</Badge>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">{sign.description}</p>
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Betekenis:</p>
                                <p className="text-xs text-foreground line-clamp-3 font-medium leading-relaxed">{sign.meaning}</p>
                              </div>
                              <TextToSpeechButton text={`${sign.name}. ${sign.description}. Betekenis: ${sign.meaning}.`} minimal />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
          <div className="mt-20"><DonationPrompt /></div>
        </section>
      </div>
      <Footer />
    </div>
  )
}


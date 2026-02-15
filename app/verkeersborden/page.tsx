"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Search, ArrowRight } from "lucide-react"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { FallbackImage } from "@/components/ui/fallback-image"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TrafficSign {
  _id: string | { $oid: string }
  description: string
  category: string
  image: string
  hoverHint?: string
  createdAt?: string
  updatedAt?: string
}

export default function TrafficSignsPage() {
  const [signs, setSigns] = useState<TrafficSign[]>([])
  const [filteredSigns, setFilteredSigns] = useState<TrafficSign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  const signTypes = useMemo(() => [
    { id: "all", label: "Alles" },
    { id: "Waarschuwingsborden", label: "Waarschuwing" }, 
    { id: "Snelheidsborden", label: "Snelheid" }, 
    { id: "Voorrangsborden", label: "Voorrang" }, 
    { id: "Informatieborden", label: "Informatie" }, 
    { id: "Geboden en verboden", label: "Geboden/Verboden" }, 
    { id: "Rijrichtingen", label: "Rijrichtingen" }, 
    { id: "Parkeren", label: "Parkeren" }
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
        (s.description?.toLowerCase() || "").includes(lowerSearch) || 
        (s.category?.toLowerCase() || "").includes(lowerSearch)
      )
    }
    if (selectedType !== "all") {
      filtered = filtered.filter(s => s.category === selectedType)
    }
    setFilteredSigns(filtered)
  }, [searchTerm, selectedType, signs])

  const typeCounts = useMemo(() => {
    return signTypes.map((typeObj) => {
      const type = typeObj.id
      const count = type === "all" 
        ? signs.length 
        : signs.filter((s) => s.category === type).length
      return {
        ...typeObj,
        count
      }
    })
  }, [signs, signTypes])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1 pb-20">
        
        {/* Header Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
          <div className="container mx-auto px-4 max-w-7xl animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verkeersborden</h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              Leer alle verkeersborden die je moet kennen voor het CBR theorie-examen. Zoek op trefwoord of filter per categorie.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Nieuw</p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Interactieve bordentraining</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  Oefen direct met meerkeuzevragen en leer verkeersborden sneller herkennen.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                <Link href="/verkeersborden/oefenen">
                  Start bordentraining
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-auto p-6 mb-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between animate-fade-up animate-delay-1">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Zoek verkeersbord..." 
                className="pl-10 h-11 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-visible:ring-blue-500 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {typeCounts.filter(t => t.count > 0 || t.id === "all").map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                    selectedType === type.id 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-none" 
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <LoadingSpinner className="h-10 w-10 text-blue-600" />
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Verkeersborden laden...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm px-6">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <Button onClick={fetchSigns} variant="outline" className="font-bold">Probeer opnieuw</Button>
            </div>
          ) : filteredSigns.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm px-6">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium mb-4">Geen verkeersborden gevonden voor deze zoekopdracht.</p>
              <Button onClick={() => {setSearchTerm(""); setSelectedType("all")}} variant="ghost" className="text-blue-600 font-bold">Herstel filters</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-12 sm:gap-16">
              {signTypes.filter(type => type.id !== "all" && filteredSigns.some(s => s.category === type.id)).map((type) => (
                <div key={type.id} className="animate-fade-up">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {type.label}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    <Badge variant="secondary" className="rounded-lg h-7 px-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-0">
                      {filteredSigns.filter(s => s.category === type.id).length} Borden
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSigns.filter(s => s.category === type.id).map((sign) => {
                      const signId = typeof sign._id === 'string' ? sign._id : sign._id?.$oid;
                      
                      return (
                        <div key={signId} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-start gap-5">
                          {/* Image Design */}
                          <div className="w-24 h-24 relative bg-slate-50 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors shadow-inner overflow-hidden">
                            <FallbackImage 
                              src={sign.image} 
                              fallbackSrc="/images/verkeersborden/placeholder.png"
                              alt={sign.description}
                              fill
                              sizes="96px"
                              className="object-contain p-1 filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                          </div>

                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight h-5 px-2 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                {sign.category}
                              </Badge>
                              <TextToSpeechButton 
                                text={sign.description} 
                                className="h-8 w-8 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-0 rounded-full" 
                                minimal={true}
                              />
                            </div>
                            
                            <h3 className="font-bold text-slate-900 dark:text-white text-md leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {sign.description}
                            </h3>
                            
                            {sign.hoverHint && (
                              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed italic line-clamp-2">
                                {sign.hoverHint}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

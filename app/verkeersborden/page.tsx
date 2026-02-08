"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Search, Info, Award } from "lucide-react"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { FallbackImage } from "@/components/ui/fallback-image"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    { id: "waarschuwing", label: "Waarschuwing" }, 
    { id: "snelheid", label: "Snelheid" }, 
    { id: "voorrang", label: "Voorrang" }, 
    { id: "informatie", label: "Informatie" }, 
    { id: "verbod", label: "Verbod" }, 
    { id: "rijrichting", label: "Rijrichting" }, 
    { id: "parkeren", label: "Parkeren" }
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
        (s.name?.toLowerCase() || "").includes(lowerSearch) || 
        (s.meaning?.toLowerCase() || "").includes(lowerSearch) ||
        (s.description?.toLowerCase() || "").includes(lowerSearch)
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
    return signTypes.map((typeObj) => {
      const type = typeObj.id
      const count = type === "all" 
        ? signs.length 
        : signs.filter((s) => {
            const signType = s.type || (Array.isArray(s.category) ? s.category[0] : s.category)
            return signType?.toLowerCase() === type.toLowerCase()
          }).length
      return {
        ...typeObj,
        count
      }
    })
  }, [signs, signTypes])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pb-20">
        
        {/* Header Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verkeersborden</h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              Leer alle verkeersborden die je moet kennen voor het CBR theorie-examen. Zoek op trefwoord of filter per categorie.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
          
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-auto p-6 mb-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSigns.map((sign) => {
                const signId = typeof sign._id === 'string' ? sign._id : sign._id?.$oid;
                const displayType = sign.type || (Array.isArray(sign.category) ? sign.category[0] : sign.category);
                
                return (
                  <div key={signId} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-start gap-5">
                    {/* Bigger Card Design */}
                    <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center p-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors shadow-inner">
                      <FallbackImage 
                        src={sign.image} 
                        fallbackSrc="/images/traffic-signs/placeholder.png"
                        alt={sign.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight h-5 px-2 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                           {displayType}
                        </Badge>
                        <TextToSpeechButton 
                          text={sign.name + ". Betekenis: " + sign.meaning} 
                          className="h-8 w-8 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-0 rounded-full" 
                          minimal={true}
                        />
                      </div>
                      
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                         {sign.name}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                         {sign.meaning}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

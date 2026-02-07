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
        <div className="bg-slate-900 text-white pt-12 pb-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verkeersborden</h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              Leer alle verkeersborden die je moet kennen voor het CBR theorie-examen. Zoek op trefwoord of filter per categorie.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-7xl -mt-12">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Zoek verkeersbord..." 
                className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus-visible:ring-blue-500 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {typeCounts.filter(t => t.count > 0 || t.id === "all").map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedType === type.id 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <LoadingSpinner className="h-10 w-10 text-blue-600" />
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Verkeersborden laden...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-red-100 shadow-sm px-6">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <Button onClick={fetchSigns} variant="outline" className="font-bold">Probeer opnieuw</Button>
            </div>
          ) : filteredSigns.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium mb-4">Geen verkeersborden gevonden voor deze zoekopdracht.</p>
              <Button onClick={() => {setSearchTerm(""); setSelectedType("all")}} variant="ghost" className="text-blue-600 font-bold">Herstel filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSigns.map((sign) => {
                const signId = typeof sign._id === 'string' ? sign._id : sign._id?.$oid;
                const displayType = sign.type || (Array.isArray(sign.category) ? sign.category[0] : sign.category);
                
                return (
                  <div key={signId} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all flex flex-col h-full transform hover:-translate-y-1 duration-300">
                    {/* Image Container */}
                    <div className="aspect-square bg-slate-50 relative flex items-center justify-center p-8 transition-colors group-hover:bg-blue-50/20">
                      <FallbackImage 
                        src={sign.image} 
                        fallbackSrc="/images/traffic-signs/placeholder.png"
                        alt={sign.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-slate-600 border-slate-100 font-bold text-[10px] uppercase">
                        {sign.name}
                      </Badge>
                    </div>

                    {/* Info Container */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                         <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                           {sign.meaning}
                         </h3>
                         <TextToSpeechButton 
                            text={sign.name + ". Betekenis: " + sign.meaning + ". " + sign.description} 
                            className="h-8 w-8 text-slate-400 hover:text-blue-500 flex-shrink-0" 
                         />
                      </div>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 font-medium leading-relaxed">
                        {sign.description || "Geen beschrijving beschikbaar voor dit verkeersbord."}
                      </p>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                            <Info className="h-3.5 w-3.5" />
                            <span>{displayType}</span>
                         </div>
                         <div className="text-slate-300">
                           <Award className="h-4 w-4" />
                         </div>
                      </div>
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

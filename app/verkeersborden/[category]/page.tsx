"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { HighlightableText } from "@/components/HighlightableText"
import { cleanForSpeech } from "@/lib/utils"
import { Search, Car, Filter, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Footer from "@/components/footer"
import DonationPrompt from "@/components/DonationPrompt"

interface TrafficSign {
  _id: string
  name: string
  description: string
  meaning: string
  category: string
  type: string
  shape: string
  color: string
  image: string
  applicableFor: string[]
  createdAt: string
  updatedAt: string
}

// Simple SVG fallback placeholder
const createPlaceholderSVG = (width = 160, height = 160) => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 3}" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
      <text x="${width / 2}" y="${height / 2 + 5}" textAnchor="middle" fill="#6b7280" fontFamily="Arial, sans-serif" fontSize="14">?</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function CategoryTrafficSignsPage() {
  const params = useParams()
  const category = params.category as string
  const [signs, setSigns] = useState<TrafficSign[]>([])
  const [filteredSigns, setFilteredSigns] = useState<TrafficSign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [mounted, setMounted] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  const categoryInfo = {
    auto: {
      name: "Auto Verkeersborden",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Alle verkeersborden die relevant zijn voor autobestuurders",
    },
    alle: {
      name: "Alle Verkeersborden",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Alle Nederlandse verkeersborden voor het B-rijbewijs",
    },
  }

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo]
  const IconComponent = currentCategory?.icon || Car

  const signTypes = [
    "waarschuwing", "snelheid", "voorrang", "informatie", "verbod", "rijrichting", "parkeren",
  ]

  // Image fallback
  const handleImageError = (signId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imageErrors.has(signId)) {
      setImageErrors((prev) => new Set(prev).add(signId))
      event.currentTarget.src = createPlaceholderSVG(160, 160)
    }
  }

  const fetchSigns = async () => {
    if (!mounted) {
      console.log("[Fetch] Skipping fetch: component not mounted yet.")
      return
    }

    console.log(`[Fetch] Starting request to /api/traffic-signs for category: '${category}'`)

    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/traffic-signs")

      console.log(`[Fetch] Response status: ${res.status}`)

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`)
      }

      const data = await res.json()
      console.log("[Fetch] Raw response data:", data)

      const trafficSigns = data?.trafficSigns

      if (!Array.isArray(trafficSigns)) {
        throw new Error("Invalid response format: 'trafficSigns' is not an array")
      }

      console.log(`[Fetch] Received ${trafficSigns.length} total traffic signs.`)

      const filtered = category === "alle"
        ? trafficSigns
        : trafficSigns.filter((sign: TrafficSign) =>
            Array.isArray(sign.category) &&
            sign.category.map((c) => c.toLowerCase()).includes(category.toLowerCase())
          )


      console.log(`[Filter] After filtering for category '${category}': ${filtered.length} signs.`)

      setSigns(filtered)
      setFilteredSigns(filtered)
      console.log("[State] Signs and filteredSigns updated successfully.")
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Onbekende fout tijdens het ophalen van verkeersborden."
      console.error("[Error] Verkeersborden ophalen mislukt:", errorMsg)

      setError("Er is een fout opgetreden bij het laden van de verkeersborden.")
      setSigns([])
      setFilteredSigns([])
    } finally {
      setLoading(false)
      console.log("[Fetch] Done.")
    }
  }


  useEffect(() => {
    if (category && mounted) {
      fetchSigns()
    }
  }, [category, mounted])

  useEffect(() => {
    let filtered = signs

    if (searchTerm) {
      filtered = filtered.filter((sign) =>
        sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sign.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((sign) => sign.type === selectedType)
    }

    setFilteredSigns(filtered)
  }, [signs, searchTerm, selectedType])

  const typeCounts = ["all", ...signTypes].map((type) => ({
    id: type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count: type === "all" ? signs.length : signs.filter((s) => s.type === type).length,
  }))

  const getTypeColor = (type: string) => {
    const colors = {
      gebod: "bg-blue-50 text-blue-700 border-blue-200",
      verbod: "bg-red-50 text-red-700 border-red-200",
      waarschuwing: "bg-yellow-50 text-yellow-700 border-yellow-200",
      voorrang: "bg-purple-50 text-purple-700 border-purple-200",
      informatie: "bg-green-50 text-green-700 border-green-200",
      snelheid: "bg-orange-50 text-orange-700 border-orange-200",
      rijrichting: "bg-indigo-50 text-indigo-700 border-indigo-200",
      parkeren: "bg-gray-50 text-gray-700 border-gray-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getShapeIcon = (shape: string) => {
    const shapes = {
      rond: "⭕",
      driehoek: "🔺",
      vierkant: "⬜",
      achthoek: "🛑",
      ruit: "🔶",
    }
    return shapes[shape as keyof typeof shapes] || "⬜"
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md border-border bg-card shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Categorie niet gevonden</CardTitle>
            <CardDescription className="text-muted-foreground">De opgevraagde categorie bestaat niet.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/verkeersborden">Terug naar Overzicht</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <section>
          <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`${currentCategory.bgColor} p-4 rounded-2xl shadow-sm border border-border`}> 
                <IconComponent className={`h-8 w-8 ${currentCategory.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Categorie</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-2">{currentCategory.name}</h1>
                <p className="text-muted-foreground text-sm mt-2">{currentCategory.description}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-3 text-sm text-muted-foreground">
              {signs.length} borden in deze categorie
            </div>
          </div>
        </div>
        </section>

        <section className="container mx-auto px-4 pt-8 pb-12 max-w-7xl">

            {/* Right: Back Link */}
            <Link
              href="/verkeersborden"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar overzicht
            </Link>
        </section>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Zoek verkeersborden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Filter:</span>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {typeCounts.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedType === type.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border hover:border-slate-300"
              }`}
            >
              {type.name} ({type.count})
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Er is een probleem opgetreden</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <Button
                  onClick={fetchSigns}
                  variant="outline"
                  size="sm"
                  className="ml-auto border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Opnieuw proberen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verkeersborden laden...</p>
          </div>
        )}

        {/* Traffic Signs Grid */}
        {!loading && (
          <>
            <div className="mb-4 text-sm text-muted-foreground font-medium">
              {filteredSigns.length} van {signs.length} borden
            </div>

            {filteredSigns.length === 0 ? (
              <Card className="text-center py-12 border-border shadow-sm">
                <CardContent>
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {signs.length === 0
                      ? "Er zijn momenteel geen verkeersborden beschikbaar."
                      : "Geen verkeersborden gevonden voor je zoekopdracht."}
                  </p>
                  {signs.length > 0 && (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedType("all")
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Filters Wissen
                    </Button>
                  )}
                  {signs.length === 0 && (
                    <Button onClick={fetchSigns} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Opnieuw laden
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredSigns.map((sign) => {
                  const cleanName = cleanForSpeech(sign.name || "")
                  const cleanDesc = cleanForSpeech(sign.description || "")
                  const cleanMeaning = cleanForSpeech(sign.meaning || "")
                  
                  // Construct full text exactly as it will be spoken
                  const fullCardText = `${cleanName}. ${cleanDesc}. Betekenis: ${cleanMeaning}.`
                  
                  // Calculate offsets based on the exact structure above
                  const nameOffset = 0
                  // + 2 for the ". " joiner
                  const descOffset = cleanName ? cleanName.length + 2 : (fullCardText.indexOf(cleanDesc) !== -1 ? fullCardText.indexOf(cleanDesc) : 0)
                  
                  // Find the start of the "Betekenis: " label
                  const meaningLabelPrefix = "Betekenis: "
                  const meaningLabelOffset = fullCardText.indexOf(meaningLabelPrefix)
                  
                  // The actual meaning text starts after the label
                  const meaningTextOffset = meaningLabelOffset !== -1 ? meaningLabelOffset + meaningLabelPrefix.length : -1

                  return (
                    <Card
                      key={sign._id}
                      className="group bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-5">
                        {/* Sign Image */}
                        <div className="bg-muted border border-border rounded-xl p-6 mb-4 text-center group-hover:bg-card transition-colors">
                          <img
                            src={imageErrors.has(sign._id) ? createPlaceholderSVG(160, 160) : sign.image}
                            alt={sign.name}
                            className="w-40 h-40 mx-auto object-contain drop-shadow-sm"
                            onError={(e) => handleImageError(sign._id, e)}
                            loading="lazy"
                          />
                        </div>

                        {/* Sign Info */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 flex-1">
                              <HighlightableText text={sign.name} offset={nameOffset} />
                            </h3>
                            <span className="text-lg ml-2 flex-shrink-0" title={`Vorm: ${sign.shape}`}>
                              {getShapeIcon(sign.shape)}
                            </span>
                          </div>

                          <Badge className={`${getTypeColor(sign.type)} text-xs font-medium border px-2 py-0.5 rounded-md`} variant="outline">
                            {sign.type.charAt(0).toUpperCase() + sign.type.slice(1)}
                          </Badge>

                          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            <HighlightableText text={sign.description} offset={descOffset} />
                          </div>

                          <div className="pt-3 border-t border-border flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-foreground mb-1">
                                <HighlightableText text="Betekenis:" offset={meaningLabelOffset} />
                              </p>
                              <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                <HighlightableText text={sign.meaning} offset={meaningTextOffset} />
                              </div>
                            </div>
                            <TextToSpeechButton text={fullCardText} minimal />
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

        {/* Study Tips */}
        <Card className="mt-12 border border-border bg-card shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-foreground">Studietips voor Verkeersborden</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-foreground mb-3">Herkenning Tips:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Let op de vorm: rond (gebod), driehoek (waarschuwing), achthoek (stop)</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Kleur is belangrijk: rood (verbod), blauw (gebod), geel (waarschuwing)</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Symbolen zijn universeel en logisch ontworpen</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Oefen regelmatig met verschillende combinaties</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">Examen Tips:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Verkeersborden vormen 20-30% van het theorie-examen</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Let goed op details in de vraagstelling</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Sommige borden gelden alleen voor specifieke voertuigen</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Begrijp de betekenis, niet alleen de vorm</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <DonationPrompt />
      <Footer />
    </div>
  )
}

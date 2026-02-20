"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import LessonContent, { InhoudBlok } from "@/components/LessonContent"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { HighlightableHtml } from "@/components/HighlightableHtml"
import { stripHtml, cleanForSpeech, formatLessonContent } from "@/lib/utils"
import { ChevronDown, ChevronRight, Menu, X, Lock, BookOpen } from "lucide-react"
import clsx from "clsx"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Footer from "@/components/footer"
import { useSession } from "next-auth/react"
import LoadingSpinner from "@/components/LoadingSpinner"

interface LesData {
  id?: string
  titel: string
  inhoud: InhoudBlok[] | string
  volgorde?: number
  isLocked?: boolean
}

interface Subles {
  titel: string
  volgorde: number
  isLocked: boolean
}

interface CategorieGroep {
  categorie: string
  titel: string
  sublessen: Subles[]
}

export default function LesPagina() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner className="h-10 w-10" />
        </div>
      }
    >
      <LesPaginaContent />
    </Suspense>
  )
}

function LesPaginaContent() {
  const { categorie } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { status } = useSession()

  const [groepen, setGroepen] = useState<CategorieGroep[]>([])
  const [actieveGroep, setActieveGroep] = useState<string | null>(categorie as string)
  const [actieveLes, setActieveLes] = useState<LesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accessInfo, setAccessInfo] = useState<{
    hasActivePlan: boolean
    lessonAccessMaxOrder: number | null
  } | null>(null)

  const lesIndexParam = searchParams.get("les")
  const lesVolgorde = parseInt(lesIndexParam || "1", 10)

  // Tone styles for personality
  const toneStyles: Record<string, { bg: string; text: string; border: string }> = {
    milieu: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
    verkeersborden: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
    verkeersregels: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
    veiligheid: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
    voorrang: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800" },
    weggebruikers: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
    voertuig: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
    verkeerswetten: { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
    default: { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
  }

  // Get current category tone
  const currentToneKey = Object.keys(toneStyles).find((k) => 
    (actieveGroep || "").toLowerCase().includes(k)
  ) || "default"
  const tone = toneStyles[currentToneKey]

  // Sync state with URL when it changes
  useEffect(() => {
    if (categorie) {
      setActieveGroep(categorie as string)
    }
  }, [categorie])

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch all categories and their lessons in one go for much faster loading
        const res = await fetch(`/api/leren?voertuig=auto&includeLessons=true`)
        if (!res.ok) throw new Error("Failed to fetch lessons")
        
        const data = await res.json()
        const groepen: CategorieGroep[] = data.map((cat: any) => ({
          categorie: cat.slug,
          titel: cat.title,
          sublessen: cat.lessons.map((l: any) => ({
            titel: l.title,
            volgorde: l.order,
            isLocked: l.isLocked,
          })),
        }))

        setGroepen(groepen)
      } catch (err) {
        console.error("Fout bij laden van data:", err)
      }
    }

    fetchAllData()
  }, [])

  useEffect(() => {
    async function fetchAccess() {
      if (status === "loading") return
      try {
        const res = await fetch("/api/access")
        if (!res.ok) return
        const data = await res.json()
        setAccessInfo({
          hasActivePlan: Boolean(data.hasActivePlan),
          lessonAccessMaxOrder: data.lessonAccessMaxOrder ?? null,
        })
      } catch (err) {
        console.error("Fout bij laden toegang:", err)
      }
    }

    fetchAccess()
  }, [status])

  useEffect(() => {
    async function fetchActiveLesson() {
      if (!actieveGroep) return
      setLoading(true)
      try {
        const res = await fetch(`/api/leren?voertuig=auto&categorie=${actieveGroep}`)
        if (res.ok) {
          const lessen = await res.json()
          const gesorteerdeLessen = [...lessen].sort((a: any, b: any) => {
            const aOrder = typeof a.order === "number" ? a.order : parseInt(a.order ?? "0", 10)
            const bOrder = typeof b.order === "number" ? b.order : parseInt(b.order ?? "0", 10)
            return aOrder - bOrder
          })

          const les = gesorteerdeLessen.find((l: any) => {
            const v = typeof l.order === "number" ? l.order : parseInt(l.order ?? "1", 10)
            return v === lesVolgorde
          }) || gesorteerdeLessen[0]

          const gevondenLesOrder =
            typeof les?.order === "number" ? les.order : parseInt(les?.order ?? "1", 10)

          if (les && gevondenLesOrder !== lesVolgorde) {
            router.replace(`/leren/${actieveGroep}?les=${gevondenLesOrder}`)
          }

          if (les) {
            setActieveLes({
              id: les._id?.toString(),
              titel: les.title,
              inhoud: les.content,
              volgorde: lesVolgorde,
              isLocked: Boolean(les.isLocked),
            })
          }
        }
      } catch (err) {
        console.error("Fout bij laden les:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActiveLesson()
    setMobileMenuOpen(false)
  }, [actieveGroep, lesVolgorde])

  useEffect(() => {
    async function saveProgress() {
      if (status !== "authenticated") return
      if (!actieveLes?.id || actieveLes.isLocked) return

      try {
        await fetch("/api/progress/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: actieveLes.id }),
        })
      } catch (err) {
        console.error("Fout bij opslaan voortgang:", err)
      }
    }

    saveProgress()
  }, [actieveLes?.id, actieveLes?.isLocked, status])

  const huidigeGroepIndex = groepen.findIndex((g) => g.categorie === actieveGroep)
  const huidigeGroep = groepen[huidigeGroepIndex]
  const isLaatsteLesInGroep = huidigeGroep && lesVolgorde >= huidigeGroep.sublessen.length

  const gaNaarVolgende = () => {
    if (!huidigeGroep) return

    if (lesVolgorde < huidigeGroep.sublessen.length) {
      router.push(`/leren/${actieveGroep}?les=${lesVolgorde + 1}`)
    } else {
      const volgendeGroep = groepen[huidigeGroepIndex + 1]
      if (volgendeGroep) {
        router.push(`/leren/${volgendeGroep.categorie}?les=1`)
        setActieveGroep(volgendeGroep.categorie)
      } else {
        router.push("/leren")
      }
    }
    window.scrollTo(0, 0)
  }

  const gaNaarVorige = () => {
    if (lesVolgorde > 1) {
      router.push(`/leren/${actieveGroep}?les=${lesVolgorde - 1}`)
    } else {
      const vorigeGroep = groepen[huidigeGroepIndex - 1]
      if (vorigeGroep) {
        const laatsteLesVorige = vorigeGroep.sublessen.length
        router.push(`/leren/${vorigeGroep.categorie}?les=${laatsteLesVorige}`)
        setActieveGroep(vorigeGroep.categorie)
      }
    }
    window.scrollTo(0, 0)
  }

  if (!actieveGroep || (groepen.length > 0 && !huidigeGroep)) {
    return <div className="p-8 text-center text-slate-500">Onderwerp niet gevonden...</div>
  }

  // Build the full plain text for TTS (works for both structured and HTML lessons)
  const plainText = React.useMemo(() => {
    if (!actieveLes) return ""
    
    // Use DOMParser on client to match exactly what HighlightableHtml extracts.
    // This fixes issues where stripHtml() leaves entities (like &amp;) that interfere
    // with highlighting and speech since HighlightableHtml sees decoded entities.
    if (typeof window !== 'undefined' && typeof actieveLes.inhoud === 'string') {
       try {
         // Apply the same formatting HighlightableHtml uses
         const formatted = formatLessonContent(actieveLes.inhoud)
         const parser = new DOMParser()
         const doc = parser.parseFromString(formatted, 'text/html')
         
         const texts: string[] = []
         const walk = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const t = node.textContent?.trim()
              if (t) texts.push(t)
            } else {
              node.childNodes.forEach(walk)
            }
         }
         walk(doc.body)
         
         // Join text nodes with spaces, then clean. 
         // This ensures we have the "visual" text.
         return cleanForSpeech(texts.join(' '))
       } catch (e) {
         // fallback
       }
    }

    if (typeof actieveLes.inhoud === "string") {
      return cleanForSpeech(stripHtml(actieveLes.inhoud))
    }
    // Structured InhoudBlok[]
    return cleanForSpeech(
      (actieveLes.inhoud as InhoudBlok[])
        .map((b) => {
          if (b.type === "paragraaf") return b.tekst || ""
          if (b.type === "lijst") return (b.items || []).join(". ")
          return ""
        })
        .filter(Boolean)
        .join(" ")
    )
  }, [actieveLes])
  const hasPlanAccess = accessInfo?.hasActivePlan ?? false
  const isLessonLocked = Boolean(actieveLes?.isLocked)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row w-full relative z-10">
        {/* Mobile Sidebar Toggle (Visible only on mobile) */}
        {!mobileMenuOpen && (
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"
          >
            <Menu className="h-6 w-6" />
            <span>Inhoud</span>
          </button>
        )}

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={clsx(
          "lg:sticky lg:top-[65px] h-[calc(100vh-65px)] overflow-y-auto overflow-x-hidden custom-scrollbar shrink-0",
          "fixed top-0 left-0 bottom-0 z-[70] w-[85%] max-w-[280px] bg-slate-100 dark:bg-slate-900 lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-slate-800",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex flex-col py-4">
            {/* Mobile Sidebar Close Button only */}
            <div className="lg:hidden px-4 pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 space-y-6 mt-4">
              {groepen.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400 dark:text-slate-500">
                  <LoadingSpinner className="h-8 w-8 mb-4" />
                  <span className="font-medium">Onderwerpen laden...</span>
                </div>
              ) : (
                groepen.map((groep) => {
                  const isActiveGroup = actieveGroep === groep.categorie
                  return (
                    <div key={groep.categorie} className="space-y-1">
                      {/* Group Header */}
                      <h3 className="px-4 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {groep.titel}
                      </h3>

                      {/* Lessons List */}
                      <div className="flex flex-col">
                        {groep.sublessen.map((subles) => {
                          const isLocked = subles.isLocked
                          const isActive = isActiveGroup && lesVolgorde === subles.volgorde

                          if (isLocked) {
                            return (
                              <Link
                                key={subles.volgorde}
                                href="/prijzen"
                                className="group flex items-start gap-3 px-4 py-2 text-[14px] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Lock className="h-4 w-4 shrink-0 opacity-50 mt-0.5" />
                                <span className="break-words leading-snug">{subles.titel}</span>
                              </Link>
                            )
                          }

                          return (
                            <Link
                              key={subles.volgorde}
                              href={`/leren/${groep.categorie}?les=${subles.volgorde}`}
                              className={clsx(
                                "flex items-start gap-3 px-4 py-2 text-[14px] transition-all cursor-pointer",
                                isActive
                                  ? "bg-blue-600 text-white font-bold"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                              )}
                            >
                              <span className="break-words leading-snug">{subles.titel}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-w-0 p-4 lg:p-8 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
              <LoadingSpinner className="h-10 w-10" />
              <p className="text-slate-400 dark:text-slate-500 animate-pulse font-medium">Les ophalen...</p>
            </div>
          ) : isLessonLocked ? (
            <div className="rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900 p-12 text-center shadow-xl shadow-blue-50/50 dark:shadow-none min-h-[500px] flex flex-col justify-center items-center mt-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-800/50 shadow-inner">
                <Lock className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Premium Content</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 text-lg">
                Deze les is exclusief voor Premium leden. Upgrade je account om direct toegang te krijgen tot alle 1.000+ lessen en oefenexamens.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/prijzen"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-10 py-5 text-base font-bold text-white shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                >
                  Word Premium Lid
                </Link>
                <Link
                  href="/oefenexamens"
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-10 py-5 text-base font-bold transition-all"
                >
                  Gratis oefenexamen
                </Link>
              </div>
            </div>
          ) : actieveLes ? (
            <div className="flex flex-col">
              {/* Breadcrumbs */}
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/leren" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Theorie Leren</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-slate-900 dark:text-white font-medium">{huidigeGroep?.titel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
                {actieveLes?.titel || "Laden..."}
              </h1>

              {/* Top Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <button
                  onClick={gaNaarVorige}
                  disabled={huidigeGroepIndex === 0 && lesVolgorde === 1}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                  Vorige
                </button>

                <button
                  onClick={gaNaarVolgende}
                  className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white transition-all cursor-pointer ${
                      isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? (
                    "Hoofdstuk Voltooid 🎉"
                  ) : (
                    <>
                      Volgende
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-10">
                <div className="p-6 md:p-10">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tone.bg} ${tone.text}`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-sm italic">
                        Leertijd: ca. 5-10 minuten
                      </span>
                    </div>
                    <TextToSpeechButton text={plainText} />
                  </div>

                  <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-md prose-strong:text-slate-900 dark:prose-strong:text-white">
                    {typeof actieveLes.inhoud === 'string' ? (
                      <HighlightableHtml
                        html={formatLessonContent(actieveLes.inhoud)}
                        className="theory-html-content"
                      />
                    ) : (
                      <LessonContent inhoud={actieveLes.inhoud} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  )
}

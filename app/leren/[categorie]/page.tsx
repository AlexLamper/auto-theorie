"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import LessonContent, { InhoudBlok } from "@/components/LessonContent"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
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
import parse from "html-react-parser"
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
          const les = lessen.find((l: any) => {
            const v = typeof l.order === "number" ? l.order : parseInt(l.order ?? "1", 10)
            return v === lesVolgorde
          }) || lessen[0]

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

  const plainText = actieveLes ? cleanForSpeech(stripHtml(typeof actieveLes.inhoud === 'string' ? actieveLes.inhoud : '')) : ""
  const hasPlanAccess = accessInfo?.hasActivePlan ?? false
  const isLessonLocked = Boolean(actieveLes?.isLocked)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Dark Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4 max-w-[1600px]">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-400 hover:text-white transition-colors">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-600" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/leren" className="text-slate-400 hover:text-white transition-colors">Theorie Leren</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">{huidigeGroep?.titel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-white/10 border border-white/10 text-white`}>
                <BookOpen className="h-3 w-3" />
                Hoofdstuk {huidigeGroepIndex + 1}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {actieveLes?.titel || "Laden..."}
              </h1>
            </div>

            {huidigeGroep && (
              <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 hidden md:block">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Voortgang in dit hoofdstuk</div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ width: `${(lesVolgorde / huidigeGroep.sublessen.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{lesVolgorde} / {huidigeGroep.sublessen.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 max-w-[1600px] -mt-12 relative z-10 pb-20">
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

        <div className="grid gap-3 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
          
          {/* Sidebar Navigation */}
          <aside className={clsx(
            "lg:sticky lg:top-8 h-auto lg:h-[calc(100vh-6rem)]",
            "fixed top-0 left-0 bottom-0 z-[70] w-[85%] max-w-[340px] bg-white dark:bg-slate-950 lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:bg-transparent",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
             <div className="bg-white dark:bg-slate-900 lg:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none overflow-hidden h-full flex flex-col whitespace-nowrap">
                {/* Mobile Sidebar Close Button only */}
                <div className="lg:hidden p-4 border-b border-slate-100 dark:border-slate-800 flex justify-end">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 custom-scrollbar">
                  {groepen.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400 dark:text-slate-500">
                      <LoadingSpinner className="h-8 w-8 mb-4" />
                      <span className="font-medium">Onderwerpen laden...</span>
                    </div>
                  ) : (
                    groepen.map((groep, index) => {
                      const isActiveGroup = actieveGroep === groep.categorie
                      return (
                        <div key={groep.categorie} className="space-y-1">
                          {/* Compact Group Header */}
                          {groepen.length > 1 && (
                            <button
                              onClick={() => router.push(`/leren/${groep.categorie}?les=1`)}
                              className={clsx(
                                "w-full text-left px-3 py-2.5 rounded-xl transition-all text-xs font-bold flex items-center justify-between group cursor-pointer",
                                isActiveGroup 
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200"
                              )}
                            >
                              <span className="flex items-center gap-2 overflow-hidden">
                                <span className={clsx(
                                  "w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors",
                                  isActiveGroup ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                )}>
                                  {index + 1}
                                </span>
                                <span className="truncate">{groep.titel}</span>
                              </span>
                              <ChevronDown className={clsx("h-4 w-4 shrink-0 transition-transform duration-200", isActiveGroup ? "rotate-0 text-blue-500" : "-rotate-90 opacity-40")} />
                            </button>
                          )}

                          {/* Lessons List - Compacted */}
                          {isActiveGroup && (
                            <div className="space-y-0.5 mt-1 ml-2 pl-2 border-l border-slate-100 dark:border-slate-800/50">
                              {groep.sublessen.map((subles) => {
                                const isLocked = subles.isLocked
                                const isActive = isActiveGroup && lesVolgorde === subles.volgorde

                                if (isLocked) {
                                  return (
                                    <Link
                                      key={subles.volgorde}
                                      href="/prijzen"
                                      className="group flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                    >
                                      <Lock className="h-3 w-3 shrink-0 opacity-50" />
                                      <span className="truncate">{subles.titel}</span>
                                    </Link>
                                  )
                                }

                                return (
                                  <Link
                                    key={subles.volgorde}
                                    href={`/leren/${groep.categorie}?les=${subles.volgorde}`}
                                    className={clsx(
                                      "flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-all relative overflow-hidden cursor-pointer",
                                      isActive
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                  >
                                    <span className={clsx(
                                      "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                                      isActive 
                                        ? "bg-blue-600 text-white" 
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                    )}>
                                      {subles.volgorde}
                                    </span>
                                    <span className="truncate">{subles.titel}</span>
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
             </div>
          </aside>

          {/* Main Content */}
          <section className="min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <LoadingSpinner className="h-10 w-10" />
                <p className="text-slate-400 dark:text-slate-500 animate-pulse font-medium">Les ophalen...</p>
              </div>
            ) : isLessonLocked ? (
              <div className="rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900 p-12 text-center shadow-xl shadow-blue-50/50 dark:shadow-none min-h-[500px] flex flex-col justify-center items-center">
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
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 md:p-12 flex-1">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tone.bg} ${tone.text}`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-400 dark:text-slate-500 text-sm italic">
                        Leertijd: ca. 5-10 minuten
                      </span>
                    </div>
                    <TextToSpeechButton text={plainText} />
                  </div>

                  <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-3xl prose-img:shadow-lg prose-strong:text-slate-900 dark:prose-strong:text-white">
                    {typeof actieveLes.inhoud === 'string' ? (
                      <div className="theory-html-content">
                        {parse(formatLessonContent(actieveLes.inhoud))}
                      </div>
                    ) : (
                      <LessonContent inhoud={actieveLes.inhoud} />
                    )}
                  </div>

                  <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      onClick={gaNaarVorige}
                      disabled={huidigeGroepIndex === 0 && lesVolgorde === 1}
                      className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border border-slate-100 dark:border-slate-800"
                    >
                      <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                      Vorige Les
                    </button>

                    <button
                      onClick={gaNaarVolgende}
                      className={`w-full sm:w-auto flex items-center justify-center px-10 py-5 rounded-2xl font-black text-white shadow-xl shadow-blue-200 dark:shadow-none transition-all border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer transform hover:-translate-y-1 ${
                          isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? "bg-emerald-500 border-emerald-700 hover:bg-emerald-600" : "bg-blue-600 border-blue-800 hover:bg-blue-700"
                      }`}
                    >
                      {isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? (
                        "Hoofdstuk Voltooid 🎉"
                      ) : (
                        <>
                          Volgende les
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

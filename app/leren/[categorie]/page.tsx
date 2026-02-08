"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import LessonContent, { InhoudBlok } from "@/components/LessonContent"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { stripHtml, cleanForSpeech, formatLessonContent } from "@/lib/utils"
import { ChevronDown, ChevronRight, Menu, X, Lock } from "lucide-react"
import { HighlightableText } from "@/components/HighlightableText"
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
        const catRes = await fetch(`/api/leren?voertuig=auto`)
        const categorieen = await catRes.json()
        const groepen: CategorieGroep[] = []

        for (const cat of categorieen) {
          const slug = cat.slug
          const lesRes = await fetch(`/api/leren?voertuig=auto&categorie=${slug}`)
          if (!lesRes.ok) continue

          const lessen = await lesRes.json()

          groepen.push({
            categorie: slug,
            titel: cat.title,
            sublessen: lessen.map((l: any) => ({
              titel: l.title,
              volgorde: typeof l.order === "number" ? l.order : parseInt(l.order ?? "1", 10),
            })),
          })
        }

        groepen.forEach((groep) => groep.sublessen.sort((a, b) => a.volgorde - b.volgorde))
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
  const lessonLockedByPlan = accessInfo ? !hasPlanAccess && lesVolgorde > 1 : false
  const isLessonLocked = lessonLockedByPlan || Boolean(actieveLes?.isLocked)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <span className="font-bold text-slate-800 dark:text-white truncate text-sm">
            {actieveLes?.titel || "Laden..."}
          </span>
        </div>
        <Link href="/leren" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Sluiten</Link>
      </div>

      <main className="flex-1">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="mx-auto max-w-[1600px] px-4 py-6 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
            
            {/* Sidebar Navigation - LEFT SIDE */}
            <aside className={clsx(
              "lg:sticky lg:top-8 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar",
              "fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-white dark:bg-slate-900 lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:bg-transparent",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
               <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
                  {/* Sidebar Header */}
                  <div className={`p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${tone.bg}`}>
                    <div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${tone.text}`}>Cursus</div>
                      <span className="font-bold text-slate-900 dark:text-white block leading-tight">{huidigeGroep?.titel}</span>
                    </div>
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors lg:hidden"
                    >
                      <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Scrollable List */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {groepen.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-sm text-slate-400 dark:text-slate-500">
                        <LoadingSpinner className="h-6 w-6 mb-2" />
                        <span>Laden...</span>
                      </div>
                    ) : (
                      groepen.map((groep, index) => {
                        const isActiveGroup = actieveGroep === groep.categorie
                        return (
                          <div key={groep.categorie} className="space-y-1">
                            {/* Group Header */}
                            {groepen.length > 1 && (
                              <button
                                onClick={() => router.push(`/leren/${groep.categorie}?les=1`)}
                                className={clsx(
                                  "w-full text-left px-3 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-between",
                                  isActiveGroup ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                              >
                                {groep.titel}
                                {isActiveGroup && <ChevronDown className="h-3 w-3" />}
                              </button>
                            )}

                            {/* Lessons List */}
                            {(isActiveGroup || groepen.length === 1) && (
                              <div className="space-y-0.5 mt-1">
                                {groep.sublessen.map((subles) => {
                                  const isLocked = !hasPlanAccess && subles.volgorde > 1
                                  const isActive = isActiveGroup && lesVolgorde === subles.volgorde

                                  if (isLocked) {
                                    return (
                                      <Link
                                        key={subles.volgorde}
                                        href="/prijzen"
                                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                      >
                                        <Lock className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{subles.titel}</span>
                                      </Link>
                                    )
                                  }

                                  return (
                                    <Link
                                      key={subles.volgorde}
                                      href={`/leren/${groep.categorie}?les=${subles.volgorde}`}
                                      className={clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                                        isActive
                                          ? `${tone.bg} ${tone.text} font-bold shadow-sm ring-1 ring-inset ${tone.border}`
                                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium"
                                      )}
                                    >
                                      <span className={clsx(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border",
                                        isActive ? "bg-white dark:bg-slate-950 border-transparent" : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
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

            {/* Main Content - RIGHT SIDE */}
            <section className="min-w-0">
               {/* Header Breadcrumbs & Title */}
              <div className="mb-6">
                <Breadcrumb className="mb-4 hidden lg:flex">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-300 dark:text-slate-600" />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/leren" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Auto Theorie</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-300 dark:text-slate-600" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-slate-900 dark:text-white font-medium">{huidigeGroep?.titel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {actieveLes?.titel || "Laden..."}
                </h1>
              </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <LoadingSpinner className="h-10 w-10" />
                <p className="text-slate-400 dark:text-slate-500 animate-pulse font-medium">Les ophalen...</p>
              </div>
            ) : isLessonLocked ? (
              <div className="rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900 p-12 text-center shadow-lg shadow-blue-50/50 dark:shadow-none">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
                  <Lock className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Premium content</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
                  Deze les is exclusief voor Premium leden. Upgrade je account om direct toegang te krijgen tot alle lessen en oefenexamens.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link
                    href="/prijzen"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                  >
                    Bekijk Premium
                  </Link>
                  <Link
                    href="/oefenexamens"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Gratis oefenexamen
                  </Link>
                </div>
              </div>
            ) : actieveLes ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Visual Header / Banner */}
                <div className={`h-2 ${tone.bg}`} />
                
                <div className="p-6 md:p-10">
                  <div className="flex items-center justify-end mb-8">
                    <TextToSpeechButton text={plainText} />
                  </div>

                  <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400">
                    {/* Als inhoud een string is (onze HTML), renderen we die direct met parse() */}
                    {typeof actieveLes.inhoud === 'string' ? (
                      <div className="theory-html-content">
                        {parse(formatLessonContent(actieveLes.inhoud))}
                      </div>
                    ) : (
                      /* Fallback voor als je toch nog blokken gebruikt */
                      <LessonContent inhoud={actieveLes.inhoud} />
                    )}
                  </div>

                  <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                      onClick={gaNaarVorige}
                      disabled={huidigeGroepIndex === 0 && lesVolgorde === 1}
                      className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                      Vorige
                    </button>

                    <button
                      onClick={gaNaarVolgende}
                      className={`w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer ${
                          isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? "bg-emerald-500 border-emerald-700 hover:bg-emerald-600" : "bg-blue-600 border-blue-800 hover:bg-blue-700"
                      }`}
                    >
                      {isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? (
                        "Cursus afronden"
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
        </div>
      </main>
      <Footer />
    </div>
  )
}

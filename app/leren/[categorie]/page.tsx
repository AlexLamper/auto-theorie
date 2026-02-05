"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import LessonContent, { InhoudBlok } from "@/components/LessonContent"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { markeerCategorieGelezen } from "@/lib/session"
import { stripHtml, cleanForSpeech, htmlToBlocks } from "@/lib/utils"
import { ChevronDown, ChevronRight, Menu, X, Car } from "lucide-react"
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

interface LesData {
  titel: string
  inhoud: InhoudBlok[] | string
  volgorde?: number
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Laden...</div>}>
      <LesPaginaContent />
    </Suspense>
  )
}

function LesPaginaContent() {
  const { categorie } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [groepen, setGroepen] = useState<CategorieGroep[]>([])
  const [actieveGroep, setActieveGroep] = useState<string | null>(categorie as string)
  const [actieveLes, setActieveLes] = useState<LesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const lesIndexParam = searchParams.get("les")
  const lesVolgorde = parseInt(lesIndexParam || "1", 10)

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
              titel: les.title,
              inhoud: les.content,
              volgorde: lesVolgorde,
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
        markeerCategorieGelezen(actieveGroep!)
        router.push(`/leren/${volgendeGroep.categorie}?les=1`)
        setActieveGroep(volgendeGroep.categorie)
      } else {
        markeerCategorieGelezen(actieveGroep!)
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Menu className="h-5 w-5 text-muted-foreground flex-shrink-0 cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
          <span className="font-bold text-foreground truncate">
            {actieveLes?.titel || "Laden..."}
          </span>
        </div>
        <Link href="/leren" className="text-blue-600 font-medium text-sm cursor-pointer">Overzicht</Link>
      </div>

      <main className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={clsx(
          "fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-[320px] lg:relative lg:z-auto lg:translate-x-0 transition-transform duration-300 ease-in-out lg:w-80 bg-white border-r border-border flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-border flex items-center justify-between lg:hidden">
            <span className="font-bold text-foreground">Inhoudsopgave</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-muted-foreground cursor-pointer" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-6">
              {groepen.map((groep, index) => {
                const isOpgeklapt = actieveGroep === groep.categorie
                return (
                  <div key={groep.categorie} className="space-y-2">
                    <button
                      onClick={() => {
                        // Navigeer naar de eerste les van deze categorie
                        router.push(`/leren/${groep.categorie}?les=1`)
                      }}
                      className={clsx(
                        "w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer",
                        isOpgeklapt ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-muted text-muted-foreground font-medium"
                      )}
                    >
                      <span className="truncate mr-2">{index + 1}. {groep.titel}</span>
                      {isOpgeklapt ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {isOpgeklapt && (
                      <div className="ml-4 space-y-1 mt-1 border-l-2 border-blue-100 pl-4">
                        {groep.sublessen.map((subles) => (
                          <Link
                            key={subles.volgorde}
                            href={`/leren/${groep.categorie}?les=${subles.volgorde}`}
                            className={clsx(
                              "block py-2 text-sm transition-colors cursor-pointer",
                              actieveGroep === groep.categorie && lesVolgorde === subles.volgorde
                                ? "text-blue-600 font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {subles.titel}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto bg-background">
          <div className="lg:max-w-[75%] md:max-w-[90%] sm:max-w-[95%] max-w-[95%] mx-auto px-4 sm:px-8 py-8 sm:py-12">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Lesmodule</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                    {huidigeGroep?.titel || "Les"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Volg de lessen stap voor stap en navigeer eenvoudig via de inhoudsopgave.
                  </p>
                </div>
                <div className="rounded-2xl bg-background border border-border px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  {huidigeGroep?.sublessen.length || 0} lessen in deze categorie
                </div>
              </div>
            </div>

            <Breadcrumb className="mb-8 hidden lg:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-muted-foreground hover:text-blue-600 cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/leren" className="text-muted-foreground hover:text-blue-600 cursor-pointer">Auto Theorie</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">{huidigeGroep?.titel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">Les ophalen...</p>
              </div>
            ) : actieveLes ? (
              <article className="prose prose-slate prose-blue max-w-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground m-0 tracking-tight">
                      {actieveLes.titel}
                    </h1>
                    <div className="text-muted-foreground text-sm font-medium">
                      Onderwerp: {huidigeGroep?.titel} • Les {lesVolgorde} van {huidigeGroep?.sublessen.length}
                    </div>
                  </div>
                  <TextToSpeechButton text={plainText} />
                </div>

                <div className="lesson-content-wrapper min-h-[400px]">
                  {/* Als inhoud een string is (onze HTML), renderen we die direct met parse() */}
                  {typeof actieveLes.inhoud === 'string' ? (
                    <div className="theory-html-content">
                      {parse(actieveLes.inhoud)}
                    </div>
                  ) : (
                    /* Fallback voor als je toch nog blokken gebruikt */
                    <LessonContent inhoud={actieveLes.inhoud} />
                  )}
                </div>

                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    onClick={gaNaarVorige}
                    disabled={huidigeGroepIndex === 0 && lesVolgorde === 1}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl font-bold bg-card border-2 border-border text-muted-foreground hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
                    Vorige les
                  </button>

                  <button
                    onClick={gaNaarVolgende}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all border-2 border-blue-600 cursor-pointer"
                  >
                    {isLaatsteLesInGroep && huidigeGroepIndex === groepen.length - 1 ? (
                      "Afronden"
                    ) : (
                      <>
                        Volgende les
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </article>
            ) : null}
            
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

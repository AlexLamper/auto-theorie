"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import Footer from "@/components/footer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FallbackImage } from "@/components/ui/fallback-image"

interface TrafficSign {
  _id: string | { $oid: string }
  description: string
  category: string
  image: string
  hoverHint?: string
}

function shuffle<T>(list: T[]): T[] {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function TrafficSignsTrainingPage() {
  const [signs, setSigns] = useState<TrafficSign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/traffic-signs")
        if (!res.ok) throw new Error("Verkeersborden konden niet geladen worden")
        const data = await res.json()
        const allSigns: TrafficSign[] = data.trafficSigns || []

        if (allSigns.length < 4) {
          setError("Er zijn nog te weinig verkeersborden voor de training.")
          return
        }

        setSigns(shuffle(allSigns))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Onbekende fout")
      } finally {
        setLoading(false)
      }
    }

    fetchSigns()
  }, [])

  const currentSign = signs[currentIndex]

  const options = useMemo(() => {
    if (!currentSign || signs.length < 4) return []

    const wrongOptions = shuffle(
      signs.filter((s) => s.description !== currentSign.description).map((s) => s.description)
    ).slice(0, 3)

    return shuffle([currentSign.description, ...wrongOptions])
  }, [currentSign, signs])

  const handleOptionClick = (option: string) => {
    if (showAnswer || !currentSign) return

    setSelectedOption(option)
    setShowAnswer(true)

    if (option === currentSign.description) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (!signs.length) return

    const nextIndex = (currentIndex + 1) % signs.length
    setCurrentIndex(nextIndex)
    setSelectedOption(null)
    setShowAnswer(false)
  }

  const handleRestart = () => {
    setSigns((prev) => shuffle(prev))
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setShowAnswer(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1 pb-20">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-20 pt-12 border-b border-slate-700/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Interactieve bordentraining</Badge>
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">100% gratis oefenen</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Verkeersborden oefenen</h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Kies de juiste betekenis bij elk verkeersbord. Deze training is volledig gratis en je kunt onbeperkt oefenen.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
          <div className="mb-4">
            <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:cursor-pointer">
              <Link href="/verkeersborden">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar verkeersborden
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
              <LoadingSpinner className="h-10 w-10 mx-auto text-blue-600" />
              <p className="mt-4 text-slate-500">Training laden...</p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 p-12 text-center shadow-sm">
              <p className="text-red-500 font-semibold mb-6">{error}</p>
              <Button asChild variant="outline">
                <Link href="/verkeersborden">Terug naar verkeersborden</Link>
              </Button>
            </div>
          ) : currentSign ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Vraag {currentIndex + 1} van {signs.length}
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Score: {score}
                </div>
              </div>

              <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-6">
                  <div className="relative w-full h-48">
                    <FallbackImage
                      src={currentSign.image}
                      fallbackSrc="/images/verkeersborden/placeholder.png"
                      alt="Verkeersbord"
                      fill
                      sizes="280px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">
                    Wat betekent dit verkeersbord?
                  </h2>

                  <div className="space-y-3">
                    {options.map((option) => {
                      const isCorrect = option === currentSign.description
                      const isSelected = selectedOption === option

                      let optionClass = "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                      if (showAnswer && isCorrect) {
                        optionClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      } else if (showAnswer && isSelected && !isCorrect) {
                        optionClass = "border-red-500 bg-red-50 dark:bg-red-900/20"
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          disabled={showAnswer}
                          className={`w-full text-left p-4 rounded-2xl border transition-all font-medium text-slate-700 dark:text-slate-300 hover:cursor-pointer disabled:cursor-not-allowed ${optionClass}`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {showAnswer && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        Volgende vraag
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button onClick={handleRestart} variant="outline" className="rounded-xl">
                        Opnieuw starten
                        <RotateCcw className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  )
}

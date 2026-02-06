"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HighlightableText } from "@/components/HighlightableText"
import { X, ArrowRight, Timer, Trophy, AlertCircle, Lock } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function StartExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get("slug")
  
  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minuten
  const [questionTime, setQuestionTime] = useState(15)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accessMessage, setAccessMessage] = useState<string | null>(null)
  const [accessInfo, setAccessInfo] = useState<{
    hasActivePlan: boolean
    examAttemptsUsed: number
    examAttemptsLimit: number
  } | null>(null)
  const [attemptLogged, setAttemptLogged] = useState(false)

  useEffect(() => {
    if (slug) {
      fetch(`/api/oefenexamens/${slug}`)
        .then(async res => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setAccessMessage(data.message || "Je hebt geen toegang tot dit examen.")
            setLoading(false)
            return null
          }
          return res.json()
        })
        .then(data => {
          if (!data) return
          const examData = data.exam || data
          setExam(examData)
          setQuestions(examData.questions || [])
          setAnswers(new Array((examData.questions || []).length).fill(-1))
          setLoading(false)
        })
        .catch(err => {
          console.error("Error loading exam:", err)
          setLoading(false)
        })
    }
  }, [slug])

  useEffect(() => {
    async function fetchAccess() {
      try {
        const res = await fetch("/api/access")
        if (!res.ok) return
        const data = await res.json()
        setAccessInfo({
          hasActivePlan: Boolean(data.hasActivePlan),
          examAttemptsUsed: data.examAttemptsUsed || 0,
          examAttemptsLimit: data.examAttemptsLimit || 1,
        })
      } catch (err) {
        console.error("Error loading access:", err)
      }
    }

    fetchAccess()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !isFinished) {
      finishExam()
    }
  }, [timeLeft, isFinished, loading])

  // Question timer
  useEffect(() => {
    if (timerEnabled && !isFinished && !loading) {
      const qTimer = setInterval(() => {
        setQuestionTime(prev => {
          if (prev <= 1) {
            nextQuestion()
            return 15
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(qTimer)
    }
  }, [timerEnabled, isFinished, loading, current])

  useEffect(() => {
    setQuestionTime(15)
  }, [current])

  const selectAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[current] = index
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      finishExam()
    }
  }

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  const finishExam = () => {
    setIsFinished(true)
    const correctCount = questions.reduce((acc, q, i) => {
      const answer = answers[i]
      if (answer === -1) return acc
      const isCorrect = q.correct_answer_indices[answer] === 1 || q.correct_answer_indices[answer] === "1"
      return isCorrect ? acc + 1 : acc
    }, 0)

    const score = (correctCount / questions.length) * 100
    setResult({
      score,
      correctCount,
      total: questions.length,
      duration: 1800 - timeLeft
    })
  }

  useEffect(() => {
    async function logAttempt() {
      if (!isFinished || !result || attemptLogged || !slug) return
      try {
        await fetch("/api/progress/exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examSlug: slug,
            score: result.score,
            passed: result.score >= 70,
            durationSeconds: result.duration,
          }),
        })
        setAttemptLogged(true)
      } catch (err) {
        console.error("Error logging attempt:", err)
      }
    }

    logAttempt()
  }, [attemptLogged, isFinished, result, slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Examen laden...</p>
        </div>
      </div>
    )
  }

  if (accessMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-2xl w-full rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-foreground">Premium vereist</h1>
          <p className="mt-3 text-slate-600 font-medium">{accessMessage}</p>
          {accessInfo && (
            <div className="mt-4 text-xs text-slate-500">
              Pogingen gebruikt: {accessInfo.examAttemptsUsed} / {accessInfo.examAttemptsLimit}
            </div>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/prijzen"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
            >
              Bekijk Premium pakketten
            </Link>
            <Link
              href="/oefenexamens"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Terug naar examens
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!exam) return null

  if (isFinished && result) {
    const passed = result.score >= 70
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="shadow-lg border border-slate-100 rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${passed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {passed ? <Trophy size={28} /> : <AlertCircle size={28} />}
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                    {passed ? "Gefeliciteerd, je bent geslaagd" : "Niet geslaagd, nog even oefenen"}
                  </h1>
                  <p className="text-muted-foreground max-w-2xl">
                    {passed
                      ? `Je hebt het examen afgerond met een score van ${Math.round(result.score)}%. Je bent klaar voor het echte werk.`
                      : `Je hebt ${Math.round(result.score)}% behaald. Oefen nog even verder om de 70% te halen.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Jouw score</div>
              <div className={`text-4xl font-black ${passed ? "text-emerald-600" : "text-rose-600"}`}>
                {Math.round(result.score)}%
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Correcte antwoorden</div>
              <div className="text-4xl font-black text-foreground">
                {result.correctCount}<span className="text-2xl text-muted-foreground mx-1">/</span>{result.total}
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Tijd gebruikt</div>
              <div className="text-4xl font-black text-foreground">
                {Math.floor(result.duration / 60)}<span className="text-2xl text-muted-foreground">:</span>{String(result.duration % 60).padStart(2, "0")}
              </div>
            </div>
          </div>

          <Card className="shadow-sm border border-slate-100 rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-bold text-foreground">Vraagoverzicht</h3>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> Goed</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full" /> Fout</span>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 mt-6">
                {questions.map((q, i) => {
                  const answer = answers[i]
                  const isCorrect = answer !== -1 && (q.correct_answer_indices[answer] === 1 || q.correct_answer_indices[answer] === "1")

                  return (
                    <DropdownMenu key={i}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`aspect-square rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-sm ${
                            isCorrect
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 p-6 z-50 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100">
                        <div className="mb-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 inline-block ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            Vraag {i + 1} • {isCorrect ? "Correct" : "Onjuist"}
                          </span>
                          <p className="font-bold text-foreground leading-snug">{q.question_text}</p>
                        </div>

                        <div className="space-y-3">
                          <div className={`p-3 rounded-xl text-sm font-semibold ${isCorrect ? "bg-emerald-50/50 text-emerald-700" : "bg-rose-50/50 text-rose-700"}`}>
                            <span className="opacity-60 text-[10px] uppercase block mb-0.5">Jouw antwoord</span>
                            {answer !== -1 ? (q.answers[answer] || `Optie ${answer + 1}`) : "Geen antwoord"}
                          </div>

                          {!isCorrect && (
                            <>
                              <div className="p-3 rounded-xl bg-emerald-50/50 text-emerald-700 text-sm font-semibold">
                                <span className="opacity-60 text-[10px] uppercase block mb-0.5">Correct antwoord</span>
                                {q.answers[q.correct_answer_indices.findIndex((idx: any) => idx === 1 || idx === "1")] || "Zie uitleg"}
                              </div>
                              {q.explanation && (
                                <div className="p-4 bg-blue-50/50 rounded-xl text-xs text-blue-700 font-medium leading-relaxed border border-blue-100/50">
                                  <span className="font-bold uppercase tracking-widest block mb-1 opacity-60">Uitleg</span>
                                  {q.explanation}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10 border-t border-slate-100 mt-10">
                <Button
                  onClick={() => location.reload()}
                  variant="outline"
                  className="h-12 px-8 rounded-xl font-bold text-muted-foreground border-border hover:bg-muted transition-all cursor-pointer"
                >
                  Opnieuw proberen
                </Button>
                <Button
                  asChild
                  className="bg-slate-900 hover:bg-blue-600 text-white h-12 px-8 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  <Link href="/oefenexamens">Alle examens</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = String(timeLeft % 60).padStart(2, "0")

  let options = q.answers;
  if (!options || options.length === 0) {
    if (q.correct_answer_indices.length === 3) {
      options = ["Remmen", "Gas loslaten", "Niets doen"];
    } else if (q.correct_answer_indices.length === 2) {
      options = ["JA", "NEE"];
    } else {
      options = q.correct_answer_indices.map((_: any, i: number) => `Optie ${i + 1}`);
    }
  }

  return (
    <div className="fixed inset-0 top-[65px] bg-slate-100/50 flex items-center justify-center font-sans overflow-hidden z-20">
      
      <div className="w-full max-w-4xl h-[88%] bg-white shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header - Compact */}
        <header className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0 z-10">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] md:text-sm font-bold px-2 py-1 rounded shadow-sm">
                        {current + 1} / {questions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">
                        Vraag {current + 1}
                    </span>
                </div>
                
                {/* Timer Mini */}
                <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    <Timer size={14} className="text-blue-500" />
                    <span className="tabular-nums">{minutes}:{seconds}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Timer</span>
                     <button
                      onClick={() => setTimerEnabled(!timerEnabled)}
                      className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${timerEnabled ? "bg-blue-600" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${timerEnabled ? "left-4.5" : "left-0.5"}`} />
                    </button>
                 </div>
                 
                 <div className="h-4 w-px bg-slate-200 mx-1" />

                 <button
                    onClick={() => router.push("/oefenexamens")}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-colors font-bold text-[10px] md:text-xs cursor-pointer"
                  >
                    <X size={14} />
                    <span className="hidden sm:inline">Stoppen</span>
                  </button>
            </div>
        </header>

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
             
             {/* Left: Question & Image */}
             <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                 <div className="p-6 md:p-8 pb-4">
                     <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                        <HighlightableText text={q.question_text} />
                     </h1>
                 </div>

                 <div className="flex-1 p-6 pt-0 min-h-0 overflow-hidden flex items-start justify-start">
                    {q.image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={q.image}
                          alt="Situatieschets"
                          className="w-[80%] h-full object-contain object-left-top rounded-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-slate-300 bg-slate-50/50 rounded-none w-[80%] h-[80%] border-2 border-dashed border-slate-100">
                         <span className="text-xs font-bold">Geen afbeelding</span>
                      </div>
                    )}
                 </div>
             </div>

             {/* Right: Answers & Navigation */}
             <div className="w-full md:w-[280px] lg:w-[320px] flex flex-col border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/30 p-4 shrink-0 overflow-y-auto">
                <div className="flex-1 flex flex-col gap-2 justify-start">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1 text-center md:text-left">
                        Kies een antwoord
                    </div>
                    {options.map((opt: string, idx: number) => {
                        const isSelected = answers[current] === idx;
                        const letters = ['A', 'B', 'C', 'D'];
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => selectAnswer(idx)}
                            className={`
                              relative w-full p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center gap-3
                              ${isSelected 
                                 ? "border-blue-600 bg-blue-50/80 shadow-sm" 
                                 : "border-slate-200 bg-white shadow-sm hover:border-blue-200"
                              }
                            `}
                          >
                             <div className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors shrink-0
                                ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}
                             `}>
                                {letters[idx]}
                             </div>
                             <div className={`font-bold text-xs md:text-sm ${isSelected ? "text-blue-900" : "text-slate-600"}`}>
                                {opt}
                             </div>
                          </button>
                        )
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={prevQuestion}
                            disabled={current === 0}
                            className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Vorige vraag"
                        >
                           <ArrowRight size={16} className="rotate-180" />
                        </button>

                        <button
                            onClick={nextQuestion}
                            disabled={answers[current] === -1}
                            className={`
                               flex-1 h-10 flex items-center justify-center gap-2 px-4 rounded-lg font-bold text-[10px] md:text-xs transition-all cursor-pointer
                               ${answers[current] === -1 
                                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                               }
                            `}
                        >
                           <span>{current === questions.length - 1 ? "Afronden" : "Volgende vraag"}</span>
                           <ArrowRight size={16} className={answers[current] === -1 ? "opacity-0" : "opacity-100"} />
                        </button>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  )
}

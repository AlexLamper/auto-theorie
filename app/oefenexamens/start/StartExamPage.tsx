"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HighlightableText } from "@/components/HighlightableText"
import { X, ArrowRight, Timer, Trophy, AlertCircle, Lock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner"
import { FallbackImage } from "@/components/ui/fallback-image"

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
    credits: number
  } | null>(null)
  const [attemptLogged, setAttemptLogged] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCreditExam = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/oefenexamens/generate", { method: "POST" })
      if (!res.ok) {
         const data = await res.json()
         throw new Error(data.message || "Kon examen niet starten")
      }
      const data = await res.json()
      
      // Refresh credits locally if possible
      try {
        const accessRes = await fetch("/api/access")
        if (accessRes.ok) {
           const accessData = await accessRes.json()
           setAccessInfo(prev => prev ? ({ ...prev, credits: accessData.credits }) : null)
        }
      } catch(e) {}
      
      setExam(data.exam)
      setQuestions(data.exam.questions)
      setAnswers(new Array(data.exam.questions.length).fill(-1))
      setLoading(false)
    } catch (err: any) {
       setError(err.message)
       setLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get("mode") === "credit") {
      setLoading(false)
      return
    }

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
          credits: data.credits || 0,
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400 font-bold animate-pulse">Examen voorbereiden...</p>
        </div>
      </div>
    )
  }

  if (accessMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="mt-8 text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Toegang Ontzegd</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{accessMessage}</p>
          {accessInfo && (
            <div className="mt-6 inline-block px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
              Examens gebruikt: {accessInfo.examAttemptsUsed} / {accessInfo.examAttemptsLimit}
            </div>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Link href="/prijzen">Bekijk Premium Pakketten</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-8 rounded-2xl font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Link href="/oefenexamens">Terug naar Overzicht</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (searchParams.get("mode") === "credit" && !exam) {
    const used = accessInfo?.examAttemptsUsed || 0
    const limit = accessInfo?.examAttemptsLimit || 1
    const remaining = limit - used

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-xl w-full rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-2xl">
           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 mb-8">
             <Trophy className="h-10 w-10" />
           </div>
           
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Start Nieuw Examen</h1>
           <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
             Dit examen stelt een uniek examen samen uit 65 willekeurige vragen uit onze database. Dit telt als één poging op je account.
           </p>

           <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Jouw Status</p>
              <div className="flex items-center justify-center gap-3">
                 <span className={`text-4xl font-black ${remaining > 0 ? "text-slate-900 dark:text-white" : "text-rose-500"}`}>{used} / {limit}</span>
                 <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-950 px-3 py-1 rounded-full shadow-sm">Gebruikt</span>
              </div>
           </div>

           {error && (
             <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-bold border border-rose-100 dark:border-rose-900/30">
               {error}
             </div>
           )}

           <div className="flex flex-col gap-3">
             {remaining > 0 ? (
               <Button 
                 onClick={startCreditExam}
                 disabled={loading}
                 className="h-14 rounded-2xl text-lg font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
               >
                 {loading ? <LoadingSpinner className="w-6 h-6" /> : "Start Examen"}
               </Button>
             ) : (
               <Button asChild className="h-14 rounded-2xl text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
                 <Link href="/prijzen">Extra Examens Kopen</Link>
               </Button>
             )}
             
             <Button 
               asChild 
               variant="ghost" 
               className="h-12 rounded-2xl font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
             >
               <Link href="/oefenexamens">Annuleren</Link>
             </Button>
           </div>
        </div>
      </div>
    )
  }

  if (!exam) return null

  if (isFinished && result) {
    const passed = result.score >= 70
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className={`h-24 w-24 rounded-3xl flex items-center justify-center shrink-0 ${passed ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40" : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40"}`}>
                  {passed ? <Trophy size={48} className="animate-bounce" /> : <AlertCircle size={48} className="animate-pulse" />}
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {passed ? "Geslaagd!" : "Gezakt..."}
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
                    {passed
                      ? `Wat een fantastische prestatie! Je hebt het examen afgerond met een score van ${Math.round(result.score)}%. Je bent helemaal klaar voor het officiële CBR examen.`
                      : `Je hebt ${Math.round(result.score)}% behaald. Dat is helaas nog niet genoeg om te slagen, maar je bent op de goede weg! Oefen nog wat meer op de foutbeantwoorde vragen.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden transition-all hover:shadow-lg">
                <div className={`absolute top-0 left-0 w-2 h-full ${passed ? "bg-emerald-500" : "bg-rose-500"}`} />
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Jouw Score</p>
                <div className="flex items-end gap-1">
                   <span className={`text-5xl font-black ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{Math.round(result.score)}</span>
                   <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 mb-1.5">%</span>
                </div>
                <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${passed ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${result.score}%` }} />
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Correcte Antwoorden</p>
                <div className="flex items-end gap-2">
                   <span className="text-5xl font-black text-slate-900 dark:text-white">{result.correctCount}</span>
                   <span className="text-3xl font-bold text-slate-300 dark:text-slate-600 mb-1">/ {result.total}</span>
                </div>
                <div className="mt-4 flex gap-1">
                   {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (result.correctCount / result.total * 5) ? (passed ? "bg-emerald-500" : "bg-rose-500") : "bg-slate-100 dark:bg-slate-800"}`} />
                   ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tijd Gebruikt</p>
                <div className="flex items-end gap-2">
                   <span className="text-5xl font-black text-slate-900 dark:text-white">{Math.floor(result.duration / 60)}</span>
                   <span className="text-3xl font-bold text-slate-300 dark:text-slate-600 mb-1">: {String(result.duration % 60).padStart(2, "0")}</span>
                </div>
                <div className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg inline-flex items-center gap-2">
                   <Timer size={14} /> Gemiddeld {Math.round(result.duration / result.total)}s per vraag
                </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8 gap-4">
                <div>
                   <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Vraagoverzicht</h3>
                   <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Klik op een vraag om deze opnieuw te bekijken.</p>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle className="w-3.5 h-3.5" /> {result.correctCount} Goed
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                    <XCircle className="w-3.5 h-3.5" /> {result.total - result.correctCount} Fout
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mt-10">
                {questions.map((q, i) => {
                  const answer = answers[i]
                  const isCorrect = answer !== -1 && (q.correct_answer_indices[answer] === 1 || q.correct_answer_indices[answer] === "1")

                  return (
                    <DropdownMenu key={i}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`aspect-square rounded-2xl font-black text-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-sm border-2 ${
                            isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100"
                              : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50 hover:bg-rose-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 p-6 z-50 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border-none outline-hidden">
                        <div className="mb-4">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block ${isCorrect ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400"}`}>
                            Vraag {i + 1} • {isCorrect ? "Correct" : "Onjuist"}
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight text-lg">{q.question_text}</p>
                        </div>

                        <div className="space-y-3">
                          <div className={`p-4 rounded-2xl text-sm font-bold ${isCorrect ? "bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"}`}>
                            <span className="opacity-60 text-[10px] uppercase block mb-1 tracking-wider">Jouw antwoord</span>
                            {answer !== -1 ? (q.answers[answer] || `Optie ${answer + 1}`) : "Geen antwoord"}
                          </div>

                          {!isCorrect && (
                            <>
                              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-100/50 dark:border-emerald-900/30">
                                <span className="opacity-60 text-[10px] uppercase block mb-1 tracking-wider">Correct antwoord</span>
                                {q.answers[q.correct_answer_indices.findIndex((idx: any) => idx === 1 || idx === "1")] || "Zie uitleg"}
                              </div>
                              {q.explanation && (
                                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed border border-blue-100/50 dark:border-blue-900/30">
                                  <span className="font-extrabold uppercase tracking-widest block mb-1.5 opacity-60">Uitleg</span>
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

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10 border-t border-slate-100 dark:border-slate-800 mt-10">
                <Button
                  onClick={() => location.reload()}
                  variant="outline"
                  className="h-14 px-10 rounded-2xl font-black text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Opnieuw proberen
                </Button>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl font-black transition-all cursor-pointer shadow-xl shadow-blue-500/20 flex items-center gap-2"
                >
                  <Link href="/oefenexamens">
                    Alle examens
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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
    <div className="fixed inset-0 top-[65px] bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-sans overflow-hidden z-20">
      
      <div className="w-full max-w-5xl h-[85%] bg-white dark:bg-slate-900 shadow-2xl dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col mx-4">
        
        {/* Header - Modern & Clean */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white dark:bg-slate-900 shrink-0 z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white text-xs md:text-sm font-black px-3 py-1.5 rounded-xl shadow-lg shadow-blue-500/20">
                        {current + 1} / {questions.length}
                    </span>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">HUIDIGE VRAAG</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Vraag {current + 1}</p>
                    </div>
                </div>
                
                <div className="h-6 w-px bg-slate-100 dark:bg-slate-800" />

                {/* Timer Large */}
                <div className="flex items-center gap-3 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <Timer size={16} className="text-blue-500 dark:text-blue-400" />
                    <span className="tabular-nums tracking-tight">{minutes}:{seconds}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline-block">Auto-Timer</span>
                     <button
                      onClick={() => setTimerEnabled(!timerEnabled)}
                      className={`w-10 h-5 rounded-full relative transition-all duration-300 cursor-pointer ${timerEnabled ? "bg-blue-600 shadow-inner" : "bg-slate-200 dark:bg-slate-700 shadow-inner"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${timerEnabled ? "left-5.5" : "left-0.5"}`} />
                    </button>
                 </div>
                 
                 <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 hidden md:block" />

                 <button
                    onClick={() => router.push("/oefenexamens")}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all font-black text-[10px] md:text-xs cursor-pointer group uppercase tracking-widest"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors">
                      <X size={14} />
                    </div>
                    <span className="hidden sm:inline">Stoppen</span>
                  </button>
            </div>
        </header>

        {/* Main Content - Improved Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/30 dark:bg-slate-900/50">
             
             {/* Left: Question & Image - Maximum focus */}
             <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 relative">
                 <div className="p-6 md:p-10 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1 w-10 rounded-full bg-blue-600" />
                      <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Oefening</span>
                    </div>
                    <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                        <HighlightableText text={q.question_text} />
                    </h1>
                 </div>

                 <div className="flex-1 p-6 md:p-10 pt-0 min-h-0 overflow-hidden flex items-start justify-start">
                    {q.image ? (
                      <div className="relative w-full h-full max-h-[450px] group">
                        <div className="absolute -inset-4 bg-blue-500/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FallbackImage
                          src={q.image}
                          fallbackSrc="/images/exams/placeholder.jpg"
                          alt="Situatieschets"
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain object-left-top rounded-3xl transition-transform duration-500 hover:scale-[1.01]"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] w-full h-full border-4 border-dashed border-slate-100 dark:border-slate-800 p-8 text-center">
                         <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                           <AlertCircle size={32} className="text-slate-200 dark:text-slate-700" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Geen afbeelding voor deze vraag</span>
                      </div>
                    )}
                 </div>
             </div>

             {/* Right: Answers & Navigation - Sidebar style */}
             <div className="w-full md:w-[300px] lg:w-[340px] flex flex-col border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 p-5 md:p-6 shrink-0 overflow-y-auto">
                <div className="flex-1 flex flex-col gap-2.5 justify-start">
                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-400" /> Choose an answer
                    </div>
                    {options.map((opt: string, idx: number) => {
                        const isSelected = answers[current] === idx;
                        const letters = ['A', 'B', 'C', 'D'];
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => selectAnswer(idx)}
                            className={`
                              relative w-full p-3.5 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer flex items-center gap-4 group
                              ${isSelected 
                                 ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-xl shadow-blue-500/10" 
                                 : "border-transparent bg-white dark:bg-slate-800 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 hover:scale-[1.02]"
                              }
                            `}
                          >
                             <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 shrink-0
                                ${isSelected 
                                  ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30" 
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                                }
                             `}>
                                {letters[idx]}
                             </div>
                             <div className={`font-bold text-xs md:text-sm ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-slate-600 dark:text-slate-300"}`}>
                                {opt}
                             </div>
                             
                             {isSelected && (
                               <div className="ml-auto">
                                 <CheckCircle size={18} className="text-blue-600 dark:text-blue-400 animate-in zoom-in duration-300" />
                               </div>
                             )}
                          </button>
                        )
                    })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prevQuestion}
                                disabled={current === 0}
                                className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-slate-50 shadow-sm"
                                title="Vorige vraag"
                            >
                               <ArrowRight size={20} className="rotate-180" />
                            </button>

                            <button
                                onClick={nextQuestion}
                                disabled={answers[current] === -1}
                                className={`
                                   flex-1 h-12 flex items-center justify-center gap-2 px-4 rounded-xl font-black text-[11px] transition-all duration-300 cursor-pointer
                                   ${answers[current] === -1 
                                      ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed border border-slate-100 dark:border-slate-800" 
                                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 scale-[1.02] active:scale-95"
                                   }
                                `}
                            >
                               <span>{current === questions.length - 1 ? "EXAMEN AFRONDEN" : "VOLGENDE VRAAG"}</span>
                               <ArrowRight size={18} className={answers[current] === -1 ? "opacity-0 invisible" : "opacity-100 visible"} />
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  )
}

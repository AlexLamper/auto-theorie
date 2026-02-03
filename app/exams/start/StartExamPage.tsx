"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HighlightableText } from "@/components/HighlightableText"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"
import { X, ArrowRight, Timer, Trophy, AlertCircle } from "lucide-react"

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

  useEffect(() => {
    if (slug) {
      fetch(`/api/exams/${slug}`)
        .then(res => res.json())
        .then(data => {
          // De API data kan direct het object zijn OF verpakt zijn in { exam: ... }
          const examData = data.exam || data;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Examen laden...</p>
        </div>
      </div>
    )
  }

  if (!exam) return null

  if (isFinished && result) {
    const passed = result.score >= 70
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden bg-white">
            <div className={`p-12 text-center ${passed ? "bg-emerald-600" : "bg-rose-600"} text-white relative overflow-hidden`}>
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  {passed ? <Trophy size={40} /> : <AlertCircle size={40} />}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                  {passed ? "Gefeliciteerd!" : "Helaas, niet geslaagd"}
                </h1>
                <p className="text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">
                  {passed 
                    ? `Je hebt het examen succesvol afgerond met een score van ${Math.round(result.score)}%. Je bent klaar voor het echte werk!`
                    : `Je hebt een score van ${Math.round(result.score)}% behaald. Oefen nog even verder om de 70% te halen.`
                  }
                </p>
              </div>
            </div>

            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="group text-center p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:shadow-inner">
                  <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Jouw Score</div>
                  <div className={`text-5xl font-black ${passed ? "text-emerald-600" : "text-rose-600"}`}>
                    {Math.round(result.score)}%
                  </div>
                </div>
                <div className="text-center p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:shadow-inner">
                  <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Correcte Antwoorden</div>
                  <div className="text-5xl font-black text-slate-900">
                    {result.correctCount}<span className="text-2xl text-slate-300 mx-1">/</span>{result.total}
                  </div>
                </div>
                <div className="text-center p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:shadow-inner">
                  <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Tijd Gebruikt</div>
                  <div className="text-5xl font-black text-slate-900">
                    {Math.floor(result.duration / 60)}<span className="text-2xl text-slate-300">:</span>{String(result.duration % 60).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Enhanced Question Overview */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vraagoverzicht</h3>
                  <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> Goed</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full" /> Fout</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {questions.map((q, i) => {
                    const answer = answers[i]
                    const isCorrect = answer !== -1 && (q.correct_answer_indices[answer] === 1 || q.correct_answer_indices[answer] === "1")

                    return (
                      <DropdownMenu key={i}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`aspect-square rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-sm ${
                              isCorrect 
                                ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100" 
                                : "bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-6 z-50 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none">
                          <div className="mb-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 inline-block ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                              Vraag {i + 1} • {isCorrect ? "Correct" : "Onjuist"}
                            </span>
                            <p className="font-bold text-slate-900 leading-snug">{q.question_text}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className={`p-3 rounded-xl text-sm font-bold ${isCorrect ? "bg-emerald-50/50 text-emerald-700" : "bg-rose-50/50 text-rose-700"}`}>
                              <span className="opacity-60 text-[10px] uppercase block mb-0.5">Jouw antwoord</span>
                              {answer !== -1 ? (q.answers[answer] || `Optie ${answer + 1}`) : "Geen antwoord"}
                            </div>

                            {!isCorrect && (
                              <>
                                <div className="p-3 rounded-xl bg-emerald-50/50 text-emerald-700 text-sm font-bold">
                                  <span className="opacity-60 text-[10px] uppercase block mb-0.5">Correct antwoord</span>
                                  {q.answers[q.correct_answer_indices.findIndex((idx: any) => idx === 1 || idx === "1")] || "Zie uitleg"}
                                </div>
                                {q.explanation && (
                                  <div className="p-4 bg-blue-50/50 rounded-xl text-xs text-blue-700 font-medium leading-relaxed border border-blue-100/50">
                                    <span className="font-black uppercase tracking-widest block mb-1 opacity-60">Uitleg</span>
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
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 border-t border-slate-100 mt-16">
                <Button 
                  onClick={() => location.reload()} 
                  variant="outline" 
                  className="h-14 px-10 rounded-2xl font-black text-slate-600 border-slate-200 hover:bg-slate-50 transition-all cursor-pointer text-lg"
                >
                  Opnieuw Proberen
                </Button>
                <Button 
                  asChild 
                  className="bg-slate-900 hover:bg-blue-600 text-white h-14 px-10 rounded-2xl font-black transition-all cursor-pointer text-lg shadow-xl hover:shadow-blue-500/20"
                >
                  <Link href="/exams">Alle Examens</Link>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 md:gap-0">
          <div className="flex-1 pr-4">
            <div className="text-blue-600 font-black text-sm mb-4 uppercase tracking-[0.2em]">Vraag {current + 1} / {questions.length}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black max-w-4xl leading-[1.1] tracking-tight text-slate-900">
              <HighlightableText text={q.question_text} />
            </h1>
          </div>

          <div className="flex flex-col items-end gap-8 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-6 text-[13px] text-slate-400 font-black uppercase tracking-widest">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                <span>Timer aan</span>
                <button 
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${timerEnabled ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${timerEnabled ? "left-6" : "left-1"}`} />
                </button>
              </div>
              <button 
                onClick={() => router.push("/exams")}
                className="flex items-center gap-2 hover:text-rose-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm"
              >
                <X size={16} />
                <span>Stoppen</span>
              </button>
            </div>

            {/* Circular Timer */}
            <div className="relative w-24 h-24 hidden md:block">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="white" className="text-slate-100" />
                <circle 
                  cx="48" cy="48" r="44" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="none" 
                  className={`transition-all duration-1000 ease-linear ${questionTime < 5 ? "text-rose-500" : "text-emerald-500"}`}
                  strokeDasharray={276}
                  strokeDashoffset={276 - (questionTime / 15) * 276}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900 uppercase">
                {questionTime} <span className="text-[10px] ml-1">S</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 flex-1 content-start items-start">
          {/* Left: Situatieschets */}
          <div className="lg:col-span-7 aspect-video relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white group">
            {q.image && (
              <img 
                src={q.image} 
                alt="Situatieschets" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            {!q.image && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold bg-slate-50 italic">
                Geen afbeelding voor deze vraag
              </div>
            )}
            {/* Mobile Timer Overlay */}
            <div className="md:hidden absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-4 py-2 rounded-full border border-slate-100 shadow-xl">
              {questionTime} SEC
            </div>
          </div>

          {/* Right: Answer Options */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={`group flex items-center p-6 bg-white rounded-2xl shadow-sm border-2 transition-all text-left w-full hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  answers[current] === idx ? "border-blue-600 ring-4 ring-blue-500/10 shadow-lg" : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 shadow-slate-200/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl mr-5 shrink-0 transition-all ${
                  answers[current] === idx ? "bg-blue-600 text-white shadow-lg rotate-3" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                }`}>
                  {["A", "B", "C", "D"][idx]}
                </div>
                <span className={`font-bold text-[17px] leading-snug transition-colors ${
                  answers[current] === idx ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                }`}>
                  <HighlightableText text={opt} />
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 flex justify-end pb-12">
          <button
            onClick={nextQuestion}
            disabled={answers[current] === -1}
            className={`flex items-center gap-4 px-12 py-5 rounded-[1.25rem] font-black text-xl transition-all cursor-pointer shadow-xl ${
              answers[current] === -1 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed grayscale" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0"
            }`}
          >
            {current === questions.length - 1 ? "Examen afronden" : "Volgende vraag"}
            <ArrowRight size={24} className={answers[current] === -1 ? "opacity-30" : "animate-pulse"} />
          </button>
        </footer>
      </div>
    </div>
  )
}

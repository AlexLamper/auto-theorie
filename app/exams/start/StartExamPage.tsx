"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HighlightableText } from "@/components/HighlightableText"
import { TextToSpeechButton } from "@/components/TextToSpeechButton"

export default function StartExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get("slug")
  
  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minuten
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

  const selectAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[current] = index
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
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
      <div className="min-h-screen bg-slate-50 py-10 px-4 overflow-y-auto">
        <div className="container max-w-4xl mx-auto">
          <Card className="shadow-xl border-none rounded-3xl overflow-hidden">
            <div className={`p-8 text-center ${passed ? "bg-green-600" : "bg-red-600"} text-white`}>
              <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">
                {passed ? "Gefeliciteerd!" : "Helaas, niet gezakt"}
              </h1>
              <p className="opacity-90 font-medium">Je hebt het oefenexamen afgerond.</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Jouw Score</div>
                  <div className={`text-3xl font-black ${passed ? "text-green-600" : "text-red-600"}`}>
                    {Math.round(result.score)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Benodigd</div>
                  <div className="text-2xl font-bold text-slate-900">70%</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Tijd</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {Math.floor(result.duration / 60)}:{String(result.duration % 60).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Question Grid */}
              <div className="mb-0">
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Overzicht antwoorden</h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {questions.map((q, i) => {
                    const answer = answers[i]
                    const isCorrect = answer !== -1 && (q.correct_answer_indices[answer] === 1 || q.correct_answer_indices[answer] === "1")

                    return (
                      <DropdownMenu key={i}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`aspect-square rounded-lg font-extrabold text-xs flex items-center justify-center border transition-all ${
                              isCorrect 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            {i + 1}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-4 z-50 bg-white rounded-xl shadow-xl">
                          <p className="font-bold text-slate-900 mb-2">{q.question_text}</p>
                          <div className="space-y-1 text-sm">
                            <p>Jouw: <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                              {answer !== -1 ? (q.answers[answer] || `Optie ${answer + 1}`) : "Geen"}
                            </span></p>
                            {!isCorrect && (
                              <>
                                <p>Correct: <span className="text-green-600 font-bold">
                                  {q.answers[q.correct_answer_indices.findIndex((idx: any) => idx === 1 || idx === "1")] || "Zie uitleg"}
                                </span></p>
                                {q.explanation && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-100">
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
              <div className="flex justify-center gap-4 pt-8 border-t border-slate-100 mt-8">
                <Button onClick={() => location.reload()} variant="outline" className="h-10 px-6 rounded-xl font-bold">Opnieuw</Button>
                <Button asChild className="bg-slate-900 text-white h-10 px-6 rounded-xl font-bold">
                  <a href="/exams">Terug</a>
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans py-4 sm:py-8">
      <div className="container max-w-4xl mx-auto px-4 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 shrink-0 px-2">
          <Button asChild variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-2 h-9">
            <a href="/exams" className="flex items-center gap-1 text-sm font-bold">← <span className="hidden sm:inline">Stoppen</span></a>
          </Button>
          <h2 className="text-sm font-black text-slate-400 text-center flex-1 truncate px-4 uppercase tracking-[0.2em]">{exam.title}</h2>
          <div className="w-12 sm:w-20" />
        </div>
        
        {/* Progress & Timer Bar */}
        <div className="mb-6 flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-black uppercase tracking-wider">
              <span>Vraag {current + 1} / {questions.length}</span>
              <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
            </div>
            <Progress
              value={((current + 1) / questions.length) * 100}
              className="h-1.5 rounded-full bg-slate-100"
            />
          </div>
          <div className={`text-xs font-black px-3 py-1.5 rounded-lg border shadow-sm transition-colors tabular-nums ${
            timeLeft < 60 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-100"
          }`}>
            {minutes}:{seconds}
          </div>
        </div>

        {/* Content Area - Gereduceerde Hoogte en Desktop Layout */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:h-[400px]">
          {/* Question & Answers Card */}
          <div className="flex-[3] flex flex-col overflow-hidden min-h-0 w-full h-full">
            <Card className="shadow-sm border-slate-100 rounded-2xl overflow-hidden bg-white flex flex-col h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-4 py-3 shrink-0">
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md mb-1 uppercase tracking-widest">
                      VRAAG {current + 1}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      <HighlightableText text={q.question_text} />
                    </CardTitle>
                  </div>
                  <div className="shrink-0">
                    <TextToSpeechButton text={`${q.question_text}. ${options.join(". ")}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar bg-white">
                {/* Mobile Image (Visible on mobile only) */}
                {q.image && (
                  <div className="lg:hidden w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm mb-3 bg-slate-50">
                    <img 
                      src={q.image} 
                      alt="Question" 
                      className="w-full h-auto object-contain max-h-[140px] mx-auto"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-1.5 pb-2">
                  {options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-150 flex items-center group cursor-pointer ${
                        answers[current] === idx
                          ? "bg-blue-50 border-blue-600 shadow-sm"
                          : "bg-white border-slate-100 hover:border-blue-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${
                        answers[current] === idx
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 group-hover:border-blue-500"
                      }`}>
                        {answers[current] === idx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm sm:text-[15px] font-bold leading-snug ${
                        answers[current] === idx ? "text-blue-900" : "text-slate-600 group-hover:text-blue-600"
                      }`}>
                        <HighlightableText text={opt} />
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Image Section (Visible on desktop only) */}
          {q.image && (
            <div className="hidden lg:block flex-[2] overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white relative h-full">
              <img 
                src={q.image} 
                alt="Question Content" 
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center gap-4 pt-2 px-2">
          <Button
            onClick={prevQuestion}
            disabled={current === 0}
            variant="outline"
            className="px-6 h-11 text-sm border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl cursor-pointer"
          >
            ← Vorige
          </Button>

          {current === questions.length - 1 ? (
            <Button
              onClick={finishExam}
              className="bg-green-600 hover:bg-green-700 text-white font-black px-10 h-11 text-sm shadow-lg hover:shadow-green-200/50 transition-all rounded-xl cursor-pointer uppercase tracking-wider"
            >
              Inleveren
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={answers[current] === -1}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 h-11 text-sm shadow-lg hover:shadow-blue-200/50 transition-all rounded-xl cursor-pointer uppercase tracking-wider"
            >
              Volgende →
            </Button>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}

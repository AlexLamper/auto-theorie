"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

type UpdateStatus = "idle" | "loading" | "success" | "unauthenticated" | "error"

export default function BetalingGeslaagdPage() {
  const [status, setStatus] = useState<UpdateStatus>("idle")
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const sessionId = searchParams.get("session_id")
    const paymentIntentId = searchParams.get("payment_intent")
    
    if (!sessionId && !paymentIntentId) return

    setStatus("loading")
    
    const endpoint = sessionId 
      ? `/api/payments/session?sessionId=${sessionId}` // Note: This might need a GET version if we use Hosted Checkout sessions
      : `/api/payments/intent?paymentIntentId=${paymentIntentId}`

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (data.email) setEmail(data.email)
        setStatus("success")
      })
      .catch(() => setStatus("error"))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <section className="flex-1 container mx-auto px-4 py-20 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-xl animate-fade-up">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          
          <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Gefeliciteerd!</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Betaling geslaagd!</h1>
          
          <div className="space-y-6 text-lg text-slate-600 font-medium">
            <p>
              Je kunt nu direct beginnen met leren. We hebben je persoonlijke toegangscode gestuurd naar:
            </p>
            {email && (
              <div className="inline-block px-6 py-2 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">
                {email}
              </div>
            )}
            <p className="text-base text-slate-500 italic">
              (Niets ontvangen? Check ook even je spam-folder)
            </p>
          </div>

          <div className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-100 text-left">
             <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Hoe log ik in?
             </h3>
             <p className="text-sm text-slate-600 leading-relaxed">
                Ga naar de inlogpagina en vul de 6-cijferige code in die je zojuist per e-mail hebt ontvangen. Je hebt geen wachtwoord nodig!
             </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]">
              <Link href="/inloggen">Direct Inloggen</Link>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 font-bold text-lg rounded-2xl hover:bg-slate-50">
              <Link href="/">Terug naar Home</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

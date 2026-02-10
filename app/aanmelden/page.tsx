"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"
import CheckoutForm from "@/components/CheckoutForm"
import { CheckCircle, ShieldCheck, Mail, User } from "lucide-react"
import Link from "next/link"

// Only load stripe if the key exists
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const planInfo: Record<string, { label: string; amount: string }> = {
  "plan_basic": { label: "Basic - 1 Dag", amount: "19,99" },
  "plan_pro": { label: "Pro - 7 Dagen", amount: "24,99" },
  "plan_premium": { label: "Premium - 31 Dagen", amount: "29,99" },
  "bundle_5": { label: "5 Oefenexamens", amount: "14,95" },
  "bundle_10": { label: "10 Oefenexamens", amount: "24,95" },
  "bundle_20": { label: "20 Oefenexamens", amount: "39,95" },
}

function AanmeldenContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || "plan_premium"
  const plan = planInfo[planId] || planInfo["plan_premium"]

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [step, setStep] = useState(1) // 1: Info, 2: Payment
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !lastName) {
      setError("Vul alle velden in.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: planId, 
          email, 
          name: `${firstName} ${lastName}` 
        }),
      })

      const data = await response.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep(2)
      } else {
        setError(data.message || "Er is een fout opgetreden bij het starten van de betaling.")
      }
    } catch (err) {
      setError("Kon geen verbinding maken met de betaalserver.")
    } finally {
      setLoading(false)
    }
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
    },
  }

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_0.8fr] gap-12 py-12 px-4 flex-1">
      {/* Left side: Form */}
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
          {step === 1 ? "Begin direct met leren" : "Veilig betalen"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
          {step === 1 
            ? "Vul je gegevens in om je persoonlijke toegangscode te ontvangen."
            : "Betaal veilig via Stripe om direct toegang te krijgen."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleStartPayment} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Voornaam
                </label>
                <Input
                  placeholder="Bijv. Jan"
                  className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Achternaam</label>
                <Input
                  placeholder="Bijv. de Vries"
                  className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                E-mailadres
              </label>
              <Input
                type="email"
                placeholder="jan@voorbeeld.nl"
                className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                 Hier sturen we je toegangscode naartoe.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
              disabled={loading}
            >
              {loading ? "Even geduld..." : "Ga naar betaling"}
            </Button>
            
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Door te betalen ga je akkoord met onze <Link href="/terms-of-service" className="underline hover:text-blue-600 transition-colors">algemene voorwaarden</Link>.
            </p>
          </form>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-up">
            {clientSecret && (
              <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <CheckoutForm planLabel={plan.label} amount={plan.amount} />
              </Elements>
            )}
            <Button 
              variant="ghost" 
              className="mt-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 w-full rounded-xl"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Terug naar gegevens
            </Button>
          </div>
        )}
      </div>

      {/* Right side: Benefits */}
      <div className="space-y-8 animate-fade-up animate-delay-1">
         <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-600/20">
            <h3 className="text-xl font-bold mb-6">Wat je krijgt:</h3>
            <ul className="space-y-4">
               {[
                 "Directe toegang na betaling",
                 "Toegangscode per mail verzonden",
                 "Geldig op alle apparaten",
                 "Officiële CBR oefenvragen 2025/2026",
                 "Veilig betalen via iDEAL of Creditcard"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-blue-200" />
                   <span className="font-medium text-blue-50 text-sm">{item}</span>
                 </li>
               ))}
            </ul>
         </div>
         
         <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8">
            <div className="flex items-center gap-4 mb-4">
               <ShieldCheck className="h-10 w-10 text-emerald-500" />
               <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">100% Veilig</h4>
                  <p className="text-xs text-slate-500">Beveiligde SSL verbinding</p>
               </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Je betaling wordt verwerkt door Stripe. Wij slaan geen bankgegevens op. Je gegevens zijn veilig bij ons.
            </p>
         </div>
      </div>
    </div>
  )
}

export default function AanmeldenPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center font-bold">Laden...</div>}>
         <AanmeldenContent />
      </Suspense>
      <Footer />
    </div>
  )
}

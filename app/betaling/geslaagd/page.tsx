"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

type UpdateStatus = "idle" | "loading" | "success" | "unauthenticated" | "error"

export default function BetalingGeslaagdPage() {
  const [status, setStatus] = useState<UpdateStatus>("idle")
  const [planLabel, setPlanLabel] = useState<string | null>(null)
  const [planExpiry, setPlanExpiry] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const sessionId = searchParams.get("session_id")
    if (!sessionId) return

    setStatus("loading")
    fetch("/api/payments/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (response) => {
        if (response.status === 401) {
          setStatus("unauthenticated")
          return
        }
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || "Onbekende fout")
        }
        if (payload?.plan) {
          setPlanLabel(payload.plan.label)
          if (payload.plan.expiresAt) {
            setPlanExpiry(new Date(payload.plan.expiresAt).toLocaleDateString("nl-NL"))
          }
        }
        setStatus("success")
      })
      .catch(() => {
        setStatus("error")
      })
  }, [])

  const statusMessage = () => {
    switch (status) {
      case "loading":
        return <p className="text-sm text-slate-500">Je betaling wordt gekoppeld aan je account.</p>
      case "success":
        return (
          <p className="text-sm text-slate-500">
            {planLabel
              ? `Je ${planLabel.toLowerCase()} is gekoppeld${planExpiry ? ` tot ${planExpiry}` : ""}.`
              : "Je betaling is gekoppeld aan je account."}
          </p>
        )
      case "unauthenticated":
        return (
          <p className="text-sm text-slate-500">
            Om deze betaling vast te leggen moet je even inloggen. <Link className="text-blue-600" href="/inloggen">Inloggen</Link>
          </p>
        )
      case "error":
        return <p className="text-sm text-slate-500">Er ging iets mis bij het koppelen van je betaling. Probeer het nogmaals.</p>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm space-y-6">
          <p className="text-sm font-semibold text-emerald-600">Betaling geslaagd</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Welkom bij Auto Theorie</h1>
          <p className="text-slate-600">
            Je betaling is ontvangen. Je toegang is nu actief en je voortgang wordt automatisch opgeslagen.
          </p>
          {statusMessage()}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <p>Je plan wordt automatisch gekoppeld aan je account.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/leren">Start met leren</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200">
              <Link href="/oefenexamens">Doe een proefexamen</Link>
            </Button>
            <Button asChild variant="ghost" className="text-slate-600 border-slate-200">
              <Link href="/account">Bekijk account</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

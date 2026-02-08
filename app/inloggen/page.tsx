"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, type FormEvent } from "react"

export default function InloggenPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const [email, setEmail] = useState("")

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    await signIn("email", { email, callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inloggen</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Log in om je voortgang, betalingen en toegang te beheren.</p>

          {isAuthenticated && session?.user && (
            <div className="mt-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-900 dark:text-emerald-100">
              <p className="font-semibold">Ingelogd als {session.user.name || session.user.email}</p>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">Je account is gekoppeld aan je betaling en voortgang.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Uitloggen
              </Button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Inloggen met Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-600">
            <span className="h-px w-full bg-slate-200 dark:bg-slate-800" />
            of
            <span className="h-px w-full bg-slate-200 dark:bg-slate-800" />
          </div>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
              <Input
                type="email"
                placeholder="jij@email.nl"
                className="mt-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Stuur magic link
            </Button>
          </form>

          <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            Nog geen account? <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/aanmelden">Aanmelden</Link>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 text-xs text-slate-500 dark:text-slate-500">
            <p>Alle betalingen en abonnementen worden veilig opgeslagen in je account zodat ze op elk apparaat beschikbaar zijn.</p>
            <p className="mt-2 font-semibold text-slate-600 dark:text-slate-400">Belangrijk: accounts worden na 1 jaar automatisch uit de database verwijderd.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

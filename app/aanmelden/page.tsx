"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState, type FormEvent } from "react"

export default function AanmeldenPage() {
  const [email, setEmail] = useState("")

  const handleEmailSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    await signIn("email", { email, callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account aanmaken</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Maak een account aan om je toegang en voortgang te bewaren.</p>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Aanmelden met Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-600">
            <span className="h-px w-full bg-slate-200 dark:bg-slate-800" />
            of
            <span className="h-px w-full bg-slate-200 dark:bg-slate-800" />
          </div>

          <form className="space-y-4" onSubmit={handleEmailSignup}>
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
            Al een account? <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/inloggen">Inloggen</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

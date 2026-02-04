"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState, type FormEvent } from "react"

export default function InloggenPage() {
  const [email, setEmail] = useState("")

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    await signIn("email", { email, callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Inloggen</h1>
          <p className="text-sm text-slate-600 mt-2">Log in om je voortgang en toegang te beheren.</p>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Inloggen met Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-400">
            <span className="h-px w-full bg-slate-200" />
            of
            <span className="h-px w-full bg-slate-200" />
          </div>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <Input
                type="email"
                placeholder="jij@email.nl"
                className="mt-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Stuur magic link
            </Button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Nog geen account? <Link className="text-blue-600 hover:underline" href="/aanmelden">Aanmelden</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

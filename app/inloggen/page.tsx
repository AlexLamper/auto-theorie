"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function InloggenPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAuthenticated = status === "authenticated"
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!code) return
    
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", { 
        code, 
        redirect: false,
        callbackUrl: "/dashboard" 
      })

      if (res?.error) {
        setError("Ongeldige toegangscode. Controleer je mail nog eens.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Er ging iets mis. Probeer het later opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <section className="flex-1 container mx-auto px-4 py-20 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 animate-fade-up">
          <div className="text-center mb-8">
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
               Inloggen op je account
             </h1>
             <p className="text-slate-600 dark:text-slate-400 text-sm">
               Gebruik de code die je in de mail hebt gekregen
             </p>
          </div>

          {isAuthenticated && session?.user ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 text-center">
              <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Je bent al ingelogd!
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">
                Ga verder naar je dashboard.
              </p>
              <div className="flex flex-col gap-3">
                 <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl">
                   <Link href="/dashboard">Naar Dashboard</Link>
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={() => signOut()}
                   className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                 >
                   Uitloggen
                 </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Toegangscode
                </label>
                <Input
                  type="text"
                  placeholder="Bijv. 123456"
                  className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-lg tracking-widest text-center font-mono focus:ring-2 focus:ring-blue-500"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium text-center border border-red-100 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? "Checking..." : "Inloggen"}
              </Button>
            </form>
          )}
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Heb je nog geen toegangscode?
            </p>
            <Link 
              href="/prijzen" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Na het bestellen kun je direct beginnen!
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

"use client"

import Link from "next/link"
import { AlertTriangle, ArrowLeftCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">

        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
            <AlertTriangle className="w-16 h-16 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Oeps... Verkeerde afslag!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
            Deze pagina bestaat niet (meer), of je hebt misschien een <span className="italic font-medium text-slate-800 dark:text-slate-200">verkeersbord</span> gemist.
          </p>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <Link href="/">
              <ArrowLeftCircle className="w-6 h-6 mr-2" />
              Terug naar de hoofdpagina
            </Link>
          </Button>

          <p className="text-sm text-slate-400 dark:text-slate-500 mt-8 font-medium">
            Foutcode: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">HTTP 404 - Bord Niet Gevonden</span>
          </p>
        </div>
      </div>
    </div>
  )
}

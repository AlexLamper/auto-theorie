import { Suspense } from "react"
import StartExamPage from "@/app/oefenexamens/start/StartExamPage"

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-8 text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium mt-4">Examen laden...</p>
        </div>
      </div>
    }>
      <StartExamPage />
    </Suspense>
  )
}

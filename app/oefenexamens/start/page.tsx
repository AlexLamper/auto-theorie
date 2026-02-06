import { Suspense } from "react"
import StartExamPage from "@/app/oefenexamens/start/StartExamPage"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-8 text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto" />
          <p className="text-slate-600 font-medium mt-4">Examen laden...</p>
        </div>
      </div>
    }>
      <StartExamPage />
    </Suspense>
  )
}

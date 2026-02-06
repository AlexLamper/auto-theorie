"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import LoadingSpinner from "@/components/LoadingSpinner"

interface Props {
  voertuig: string
  categorieen: string[]
}

export default function ProgressTracker({ voertuig, categorieen }: Props) {
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [completedCategories, setCompletedCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchProgress() {
      if (status !== "authenticated") {
        setCompletedCategories([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch("/api/progress/lessons")
        if (!res.ok) return
        const data = await res.json()
        setCompletedCategories(data.completedCategories || [])
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [status])

  const totaal = categorieen.length
  const voltooid = categorieen.filter(cat => completedCategories.includes(cat)).length
  const percentage = totaal > 0 ? Math.round((voltooid / totaal) * 100) : 0

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>Voortgang</span>
        <span>{percentage}% voltooid</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-3">
          <LoadingSpinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      )}
    </div>
  )
}
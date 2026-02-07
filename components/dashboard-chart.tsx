"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RecentScoresChart({ data }: { data: any[] }) {
  // Transform data: Reverse to show oldest -> newest left to right
  const chartData = [...data].reverse().map((attempt, index) => ({
     exam: attempt.examSlug || `Examen ${index + 1}`,
     score: attempt.score ? Math.round((attempt.score / 65) * 100) : 0, // 0-100%
     status: attempt.passed ? "Geslaagd" : "Gezakt",
     fill: attempt.passed ? "#10b981" : "#ef4444" // Emerald or Red
  }))

  const chartConfig = {
    score: {
      label: "Score (%)",
      color: "#2563eb",
    },
  } satisfies ChartConfig

  if (chartData.length === 0) {
      return (
          <div className="h-[200px] w-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
              Nog geen data beschikbaar
          </div>
      )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="exam"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.length > 5 ? value.slice(0, 5) + '...' : value}
          className="text-xs text-slate-400"
        />
        <YAxis 
            hide={false} 
            axisLine={false} 
            tickLine={false} 
            className="text-xs text-slate-400" 
            domain={[0, 100]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
            dataKey="score" 
            radius={[4, 4, 0, 0]}
            fill="currentColor"
        />
      </BarChart>
    </ChartContainer>
  )
}

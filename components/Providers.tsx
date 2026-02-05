"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeechProvider } from "@/lib/SpeechContext"
import type { Session } from "next-auth"

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SpeechProvider>{children}</SpeechProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

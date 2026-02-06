"use client"

import React from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeech } from "@/lib/SpeechContext"
import { cleanForSpeech } from "@/lib/utils"
import clsx from "clsx"
import LoadingSpinner from "@/components/LoadingSpinner"

interface TextToSpeechButtonProps {
  text: string
  label?: string
  minimal?: boolean
}

export function TextToSpeechButton({ text, label = "Voorlezen", minimal = false }: TextToSpeechButtonProps) {
  const { isSpeaking, isLoading, speak, stop, currentText } = useSpeech()
  
  const cleanText = React.useMemo(() => cleanForSpeech(text), [text])
  const isThisSpeaking = isSpeaking && currentText === cleanText

  if (!text) return null

  return (
    <Button
      variant="outline"
      size={minimal ? "icon" : "sm"}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isThisSpeaking) {
          stop()
        } else {
          // Check for selected text
          const selection = window.getSelection()?.toString().trim()
          if (selection) {
            speak(selection)
          } else {
            speak(text)
          }
        }
      }}
      disabled={isLoading && !isThisSpeaking}
      title={isThisSpeaking ? "Stoppen met voorlezen" : "Klik om de tekst voor te laten lezen"}
      className={clsx(
        "flex items-center gap-2 transition-colors",
        minimal 
          ? "h-8 w-8 rounded-full border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        isThisSpeaking && !minimal && "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 animate-pulse"
      )}
    >
      {isLoading && !isThisSpeaking ? (
        <LoadingSpinner className={minimal ? "h-3 w-3" : "h-4 w-4"} />
      ) : isThisSpeaking ? (
        <VolumeX className={minimal ? "h-3 w-3" : "h-4 w-4"} />
      ) : (
        <Volume2 className={minimal ? "h-3 w-3" : "h-4 w-4"} />
      )}
      {!minimal && <span className="hidden sm:inline">{isThisSpeaking ? "Stop" : label}</span>}
    </Button>
  )
}

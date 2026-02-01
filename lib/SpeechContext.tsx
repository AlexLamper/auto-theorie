"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { cleanForSpeech } from './utils'

interface SpeechContextType {
  isSpeaking: boolean
  currentText: string
  currentCharIndex: number
  speak: (text: string, lang?: string) => void
  stop: () => void
  isLoading: boolean
  currentRange: { start: number; end: number } | null
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined)

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SpeechProviderInner>{children}</SpeechProviderInner>
    </Suspense>
  )
}

function SpeechProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(-1)
  const [currentRange, setCurrentRange] = useState<{ start: number; end: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const chunksRef = useRef<string[]>([])
  const currentChunkIndexRef = useRef<number>(0)
  const globalOffsetRef = useRef<number>(0)

  // Function to stop speaking
  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      console.log("[SpeechContext] Stopping all speech")
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentCharIndex(-1)
      setCurrentRange(null)
      setIsLoading(false)
      chunksRef.current = []
      currentChunkIndexRef.current = 0
      globalOffsetRef.current = 0
    }
  }, [])

  // Stop speaking when navigating
  useEffect(() => {
    stop()
  }, [pathname, searchParams, stop])

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined') return
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) {
        setVoices(v)
        console.log(`[SpeechContext] Loaded ${v.length} voices`)
      }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { 
        if (typeof window !== 'undefined') window.speechSynthesis.onvoiceschanged = null 
    }
  }, [])

  // Recursive chunk speaking
  const speakChunk = useCallback((index: number) => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis

    if (index >= chunksRef.current.length) {
      console.log("[SpeechContext] All chunks finished")
      setIsSpeaking(false)
      setCurrentCharIndex(-1)
      return
    }

    const chunkText = chunksRef.current[index]
    console.log(`[SpeechContext] Speaking chunk ${index + 1}/${chunksRef.current.length} (Length: ${chunkText.length})`)
    
    const utterance = new SpeechSynthesisUtterance(chunkText)
    utterance.lang = 'nl-NL'
    utterance.rate = 0.9
    utteranceRef.current = utterance

    // Best Dutch voice selection (Google voices support onboundary better on Chrome/Windows)
    const dutchVoice = voices.find(v => v.name.includes('Google') && v.lang.toLowerCase().includes('nl-nl')) ||
                       voices.find(v => v.lang.toLowerCase().includes('nl-nl') && !v.localService) || 
                       voices.find(v => v.lang.toLowerCase().includes('nl-nl')) ||
                       voices.find(v => v.lang.toLowerCase().includes('nl'))
    if (dutchVoice) utterance.voice = dutchVoice

    utterance.onstart = () => {
      console.log(`[SpeechContext] Chunk ${index + 1} started with voice: ${utterance.voice?.name || 'default'}`)
      setIsSpeaking(true)
      setIsLoading(false)
      
      const start = globalOffsetRef.current
      const end = start + chunkText.length
      setCurrentRange({ start, end })
      
      // Initial word highlight
      setCurrentCharIndex(start)
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const absoluteIndex = globalOffsetRef.current + event.charIndex
        console.log(`[SpeechContext] Boundary: word at index ${absoluteIndex} ("${chunkText.substring(event.charIndex, event.charIndex+10)}...")`)
        setCurrentCharIndex(absoluteIndex)
      }
    }

    utterance.onend = () => {
      console.log(`[SpeechContext] Chunk ${index + 1} ended`)
      
      const nextIdx = index + 1
      if (nextIdx < chunksRef.current.length) {
        // Find exact start of next chunk in the full text to keep offsets aligned
        const searchStart = globalOffsetRef.current + chunkText.length
        const found = currentText.indexOf(chunksRef.current[nextIdx], searchStart)
        
        if (found !== -1) {
          globalOffsetRef.current = found
        } else {
          globalOffsetRef.current += chunkText.length + 1
        }
        
        currentChunkIndexRef.current = nextIdx
        speakChunk(nextIdx)
      } else {
        setIsSpeaking(false)
        setCurrentCharIndex(-1)
      }
    }

    utterance.onerror = (event) => {
      if (event.error === 'interrupted' || event.error === 'canceled') {
        console.log(`[SpeechContext] Chunk ${index + 1} stopped (${event.error})`)
        return
      }
      console.error(`[SpeechContext] Error in chunk ${index + 1}:`, event.error)
      setIsSpeaking(false)
      setIsLoading(false)
    }

    synth.speak(utterance)
    if (synth.paused) synth.resume()
  }, [voices])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !text) return
    console.log("[SpeechContext] speak() requested for text length:", text.length)
    
    stop()
    setIsLoading(true)

    const cleaned = cleanForSpeech(text)
    setCurrentText(cleaned)

    // Chunking text by sentence
    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0)
    chunksRef.current = sentences
    currentChunkIndexRef.current = 0
    globalOffsetRef.current = 0

    console.log(`[SpeechContext] Text split into ${sentences.length} chunks`)

    // Tiny delay to ensure cancel() finished
    setTimeout(() => {
      speakChunk(0)
    }, 50)
  }, [stop, speakChunk])

  return (
    <SpeechContext.Provider value={{ isSpeaking, currentText, currentCharIndex, speak, stop, isLoading, currentRange }}>
      {children}
    </SpeechContext.Provider>
  )
}

export function useSpeech() {
  const context = useContext(SpeechContext)
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider')
  }
  return context
}

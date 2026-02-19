"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { cleanForSpeech } from './utils'

// ── Public types ────────────────────────────────────────────────────────
export interface SpeechSegment {
  /** Unique id (stable across re-renders) */
  id: string
  /** The cleaned plain-text of this segment */
  text: string
}

interface SpeechContextType {
  /* playback state */
  isSpeaking: boolean
  isLoading: boolean

  /* the full cleaned text being spoken */
  currentText: string

  /**
   * Index of the sentence (chunk) currently being spoken.
   * -1 when not speaking.
   */
  activeSentenceIndex: number

  /**
   * Character offset *within the current sentence* of the word being
   * spoken right now.  -1 when unknown (browser didn't fire onboundary).
   */
  activeWordStart: number
  activeWordEnd: number

  /** The list of sentences the full text was split into. */
  sentences: string[]

  /* controls */
  speak: (text: string) => void
  stop: () => void
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined)

// ── Provider ────────────────────────────────────────────────────────────
export function SpeechProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SpeechProviderInner>{children}</SpeechProviderInner>
    </Suspense>
  )
}

/**
 * Split cleaned text into sentences.  We split on sentence-ending
 * punctuation followed by whitespace, but keep the punctuation attached to
 * the preceding sentence.
 */
function splitSentences(text: string): string[] {
  if (!text) return []
  // Split after . ! ? followed by a space (keep punctuation on the left)
  const raw = text.split(/(?<=[.!?])\s+/)
  return raw.map(s => s.trim()).filter(s => s.length > 0)
}

function SpeechProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [sentences, setSentences] = useState<string[]>([])
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1)
  const [activeWordStart, setActiveWordStart] = useState(-1)
  const [activeWordEnd, setActiveWordEnd] = useState(-1)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const sentencesRef = useRef<string[]>([])
  const currentSentenceRef = useRef(0)

  // ── Stop ───────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsLoading(false)
    setActiveSentenceIndex(-1)
    setActiveWordStart(-1)
    setActiveWordEnd(-1)
    sentencesRef.current = []
    currentSentenceRef.current = 0
  }, [])

  // stop on navigation
  useEffect(() => { stop() }, [pathname, searchParams, stop])

  // ── Load voices ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) setVoices(v)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  // ── Pick best Dutch voice ──────────────────────────────────────────
  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    return (
      voices.find(v => v.name.includes('Google') && v.lang.toLowerCase().includes('nl')) ||
      voices.find(v => v.lang.toLowerCase().startsWith('nl') && !v.localService) ||
      voices.find(v => v.lang.toLowerCase().startsWith('nl')) ||
      null
    )
  }, [voices])

  // ── Speak one sentence ─────────────────────────────────────────────
  const speakSentence = useCallback((idx: number) => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis

    if (idx >= sentencesRef.current.length) {
      // done
      setIsSpeaking(false)
      setActiveSentenceIndex(-1)
      setActiveWordStart(-1)
      setActiveWordEnd(-1)
      return
    }

    const text = sentencesRef.current[idx]
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'nl-NL'
    utt.rate = 0.9
    const voice = pickVoice()
    if (voice) utt.voice = voice
    utteranceRef.current = utt

    utt.onstart = () => {
      setIsSpeaking(true)
      setIsLoading(false)
      setActiveSentenceIndex(idx)
      setActiveWordStart(-1)
      setActiveWordEnd(-1)
    }

    utt.onboundary = (e) => {
      if (e.name === 'word') {
        const charIdx = e.charIndex
        // find word boundaries
        let start = charIdx
        let end = charIdx
        while (end < text.length && !/\s/.test(text[end])) end++
        setActiveWordStart(start)
        setActiveWordEnd(end)
      }
    }

    utt.onend = () => {
      const next = idx + 1
      currentSentenceRef.current = next
      if (next < sentencesRef.current.length) {
        speakSentence(next)
      } else {
        setIsSpeaking(false)
        setActiveSentenceIndex(-1)
        setActiveWordStart(-1)
        setActiveWordEnd(-1)
      }
    }

    utt.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return
      console.error('[SpeechContext] utterance error', e.error)
      setIsSpeaking(false)
      setIsLoading(false)
    }

    synth.speak(utt)
    if (synth.paused) synth.resume()
  }, [pickVoice])

  // ── Speak full text ────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !text) return
    stop()
    setIsLoading(true)

    const cleaned = cleanForSpeech(text)
    const sents = splitSentences(cleaned)

    setCurrentText(cleaned)
    setSentences(sents)
    sentencesRef.current = sents
    currentSentenceRef.current = 0

    // small delay so cancel() has time to complete
    setTimeout(() => speakSentence(0), 60)
  }, [stop, speakSentence])

  return (
    <SpeechContext.Provider
      value={{
        isSpeaking,
        isLoading,
        currentText,
        activeSentenceIndex,
        activeWordStart,
        activeWordEnd,
        sentences,
        speak,
        stop,
      }}
    >
      {children}
    </SpeechContext.Provider>
  )
}

export function useSpeech() {
  const ctx = useContext(SpeechContext)
  if (!ctx) throw new Error('useSpeech must be used within a SpeechProvider')
  return ctx
}

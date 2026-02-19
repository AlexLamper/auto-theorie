"use client"

import React from 'react'
import { useSpeech } from '@/lib/SpeechContext'
import { cleanForSpeech } from '@/lib/utils'
import clsx from 'clsx'

interface HighlightableTextProps {
  /** Raw (possibly HTML-containing) text to display */
  text: string
  className?: string
  /** 
   * Optional offset hint: where this text is expected to start in the full spoken text.
   * If provided, we look for the text around this offset first.
   */
  offset?: number
}

/**
 * Renders `text` with live TTS highlighting.
 *
 * Highlighting strategy:
 *  1. Clean the local text the same way SpeechContext cleans the full text.
 *  2. Walk through the context's `sentences[]` array and check which
 *     sentences overlap with this component's cleaned text.
 *  3. If the active sentence overlaps, apply a sentence-level highlight
 *     (soft background) and, when `onboundary` fires, a word-level
 *     highlight (bold yellow).
 *
 * Because both this component and SpeechContext use the same
 * `cleanForSpeech` utility, character offsets always line up.
 */
export function HighlightableText({ text, className, offset = 0 }: HighlightableTextProps) {
  const {
    isSpeaking,
    currentText,
    sentences,
    activeSentenceIndex,
    activeWordStart,
    activeWordEnd,
  } = useSpeech()

  const cleanLocal = React.useMemo(() => cleanForSpeech(text), [text])

  // ── Not speaking → plain render ────────────────────────────────────
  if (!isSpeaking || activeSentenceIndex < 0 || !currentText || !cleanLocal) {
    return <span className={className}>{text}</span>
  }

  // ── Find where this component's text lives inside the full spoken text
  // We search for cleanLocal inside currentText.  If the same fragment
  // appears more than once, we use the offset hint if provided.
  let globalStart = -1

  // If we have a specific offset, try to find the text near there first (within reasonable bounds)
  if (offset > 0) {
    // Try exact match at offset
    const substr = currentText.substring(offset, offset + cleanLocal.length)
    if (substr === cleanLocal) {
        globalStart = offset
    } else {
        // Fallback: search from offset
        globalStart = currentText.indexOf(cleanLocal, offset)
    }
  } 
  
  if (globalStart === -1) {
    // Fallback: search from beginning if not found at offset or no offset provided
    globalStart = currentText.indexOf(cleanLocal)
  }

  if (globalStart === -1) {
    return <span className={className}>{text}</span>
  }
  const globalEnd = globalStart + cleanLocal.length

  // ── Compute the char-range of the active sentence inside currentText
  let sentenceGlobalStart = 0
  for (let i = 0; i < activeSentenceIndex; i++) {
    const s = sentences[i]
    const idx = currentText.indexOf(s, sentenceGlobalStart)
    if (idx !== -1) {
      sentenceGlobalStart = idx + s.length
      // skip whitespace between sentences
      while (sentenceGlobalStart < currentText.length && /\s/.test(currentText[sentenceGlobalStart])) {
        sentenceGlobalStart++
      }
    }
  }
  // Find the exact position of the active sentence
  const activeSentence = sentences[activeSentenceIndex]
  const sentStart = currentText.indexOf(activeSentence, sentenceGlobalStart)
  const sentEnd = sentStart !== -1 ? sentStart + activeSentence.length : -1

  // ── Does the active sentence overlap with this component's range?
  const overlaps =
    sentStart !== -1 &&
    sentStart < globalEnd &&
    sentEnd > globalStart

  if (!overlaps) {
    return <span className={className}>{text}</span>
  }

  // ── Sentence-level highlight (soft bg) ─────────────────────────────
  // Map the active sentence range to local indices (clamped to our bounds)
  const localSentStart = Math.max(0, sentStart - globalStart)
  const localSentEnd = Math.min(cleanLocal.length, sentEnd - globalStart)

  // ── Word-level highlight within the sentence ───────────────────────
  let localWordStart = -1
  let localWordEnd = -1
  if (activeWordStart >= 0 && activeWordEnd > activeWordStart && sentStart !== -1) {
    // activeWordStart/End are relative to the sentence text
    const wordAbsStart = sentStart + activeWordStart
    const wordAbsEnd = sentStart + activeWordEnd
    // map to local
    if (wordAbsStart < globalEnd && wordAbsEnd > globalStart) {
      localWordStart = Math.max(0, wordAbsStart - globalStart)
      localWordEnd = Math.min(cleanLocal.length, wordAbsEnd - globalStart)
    }
  }

  // ── Render with highlights ─────────────────────────────────────────
  // We build spans from the *cleaned* text (so indices match), but we
  // display the *original* text for the non-highlighted portions.
  // Because cleanForSpeech only strips HTML and collapses whitespace,
  // the original and cleaned text are usually identical for InhoudBlok
  // content.  For safety we use cleanLocal for slicing.

  const parts: React.ReactNode[] = []
  let cursor = 0

  // before the sentence highlight
  if (localSentStart > 0) {
    parts.push(
      <span key="pre">{cleanLocal.slice(0, localSentStart)}</span>
    )
    cursor = localSentStart
  }

  // inside the sentence highlight
  if (localWordStart >= localSentStart && localWordEnd <= localSentEnd && localWordStart !== -1) {
    // before word
    if (localWordStart > cursor) {
      parts.push(
        <span
          key="sent-pre"
          className="bg-blue-100/70 dark:bg-blue-900/30 rounded-sm transition-colors duration-200"
        >
          {cleanLocal.slice(cursor, localWordStart)}
        </span>
      )
    }
    // the word itself
    parts.push(
      <mark
        key="word"
        className="bg-yellow-300 dark:bg-yellow-500/80 text-slate-900 dark:text-slate-900 rounded-sm px-0.5 font-semibold transition-all duration-75"
      >
        {cleanLocal.slice(localWordStart, localWordEnd)}
      </mark>
    )
    // after word but inside sentence
    if (localWordEnd < localSentEnd) {
      parts.push(
        <span
          key="sent-post"
          className="bg-blue-100/70 dark:bg-blue-900/30 rounded-sm transition-colors duration-200"
        >
          {cleanLocal.slice(localWordEnd, localSentEnd)}
        </span>
      )
    }
  } else {
    // no word highlight – just sentence bg
    parts.push(
      <span
        key="sent"
        className="bg-blue-100/70 dark:bg-blue-900/30 rounded-sm transition-colors duration-200"
      >
        {cleanLocal.slice(cursor, localSentEnd)}
      </span>
    )
  }

  // after the sentence highlight
  if (localSentEnd < cleanLocal.length) {
    parts.push(
      <span key="post">{cleanLocal.slice(localSentEnd)}</span>
    )
  }

  return <span className={className}>{parts}</span>
}

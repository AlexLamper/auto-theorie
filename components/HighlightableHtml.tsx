"use client"

import React, { useMemo } from "react"
import { useSpeech } from "@/lib/SpeechContext"
import { cleanForSpeech } from "@/lib/utils"

interface HighlightableHtmlProps {
  /** Raw HTML string (already sanitized / formatted) */
  html: string
  className?: string
}

/**
 * Renders HTML lesson content and applies live TTS highlighting to text
 * nodes.  Works by:
 *  1. Parsing the HTML into a temporary DOM tree (DOMParser).
 *  2. Walking over every text node and wrapping the visible text in React
 *     elements that know how to highlight themselves via the SpeechContext.
 *
 * This component is a "use client" wrapper so it can call `useSpeech()`.
 */
export function HighlightableHtml({ html, className }: HighlightableHtmlProps) {
  const {
    isSpeaking,
    currentText,
    sentences,
    activeSentenceIndex,
    activeWordStart,
    activeWordEnd,
  } = useSpeech()

  // When speaking we need to inject highlights.  We do this by replacing
  // text nodes inside the HTML with highlighted versions.  For simplicity
  // and correctness we operate at the DOM level and serialise back.
  const highlighted = useMemo(() => {
    // If not speaking or invalid state, just return original HTML
    // This logic was previously in a conditional return, which broke rules of hooks
    if (!isSpeaking || activeSentenceIndex < 0 || !currentText) {
        return html
    }

    if (typeof window === "undefined") return html
    try {
      const doc = new DOMParser().parseFromString(html, "text/html")
      highlightTextNodes(doc.body, {
        currentText,
        sentences,
        activeSentenceIndex,
        activeWordStart,
        activeWordEnd,
      })
      return doc.body.innerHTML
    } catch {
      return html
    }
  }, [html, isSpeaking, currentText, sentences, activeSentenceIndex, activeWordStart, activeWordEnd])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  )
}

// ── DOM-level highlighting helper ────────────────────────────────────────
interface HighlightOpts {
  currentText: string
  sentences: string[]
  activeSentenceIndex: number
  activeWordStart: number
  activeWordEnd: number
}

function highlightTextNodes(root: Node, opts: HighlightOpts) {
  const { currentText, sentences, activeSentenceIndex, activeWordStart, activeWordEnd } = opts

  // Compute global char range of the active sentence
  let sentSearchFrom = 0
  for (let i = 0; i < activeSentenceIndex; i++) {
    const idx = currentText.indexOf(sentences[i], sentSearchFrom)
    if (idx !== -1) {
      sentSearchFrom = idx + sentences[i].length
      while (sentSearchFrom < currentText.length && /\s/.test(currentText[sentSearchFrom])) sentSearchFrom++
    }
  }
  const activeSent = sentences[activeSentenceIndex]
  const sentGlobalStart = currentText.indexOf(activeSent, sentSearchFrom)
  const sentGlobalEnd = sentGlobalStart !== -1 ? sentGlobalStart + activeSent.length : -1

  // Walk text nodes
  const walker = (root as Document).ownerDocument
    ? (root.ownerDocument || document).createTreeWalker(root, NodeFilter.SHOW_TEXT)
    : document.createTreeWalker(root, NodeFilter.SHOW_TEXT)

  const textNodes: Text[] = []
  let node: Node | null
  while ((node = walker.nextNode())) textNodes.push(node as Text)

  // Track where we are in the global text to handle duplicate phrases correctly
  let currentSearchIdx = 0

  for (const tn of textNodes) {
    const raw = tn.textContent || ""
    const cleaned = cleanForSpeech(raw)
    if (!cleaned) continue

    // Search for this node's text starting from where the last one ended
    const globalStart = currentText.indexOf(cleaned, currentSearchIdx)
    
    if (globalStart === -1) {
        // If not found forward, it might be due to some slight mismatch or jump. 
        // We could try searching from 0 just in case, but strict order is better 
        // to avoid highlighting the wrong "the".
        // Let's just continue for now.
        continue
    }
    
    // Update search index for next time
    currentSearchIdx = globalStart + cleaned.length
    
    const globalEnd = currentSearchIdx

    // Does this text node overlap the active sentence?
    if (sentGlobalStart === -1 || sentGlobalEnd <= globalStart || sentGlobalStart >= globalEnd) {
      continue // no overlap
    }

    const localSentStart = Math.max(0, sentGlobalStart - globalStart)
    const localSentEnd = Math.min(cleaned.length, sentGlobalEnd - globalStart)

    // Compute local word range
    let localWordStart = -1
    let localWordEnd = -1
    if (activeWordStart >= 0 && activeWordEnd > activeWordStart && sentGlobalStart !== -1) {
      const wAbsStart = sentGlobalStart + activeWordStart
      const wAbsEnd = sentGlobalStart + activeWordEnd
      if (wAbsStart < globalEnd && wAbsEnd > globalStart) {
        localWordStart = Math.max(0, wAbsStart - globalStart)
        localWordEnd = Math.min(cleaned.length, wAbsEnd - globalStart)
      }
    }

    // Build replacement fragment
    const frag = tn.ownerDocument.createDocumentFragment()
    let cursor = 0

    const addText = (t: string) => {
      if (t) frag.appendChild(tn.ownerDocument.createTextNode(t))
    }
    const addHighlight = (t: string, isWord: boolean) => {
      const span = tn.ownerDocument.createElement("span")
      span.textContent = t
      if (isWord) {
        span.style.cssText =
          "background:#facc15;color:#0f172a;border-radius:3px;padding:0 2px;font-weight:600;transition:all 75ms;"
      } else {
        span.style.cssText =
          "background:rgba(191,219,254,0.5);border-radius:3px;transition:background 200ms;"
      }
      frag.appendChild(span)
    }

    // before sentence
    if (localSentStart > 0) {
      addText(cleaned.slice(0, localSentStart))
      cursor = localSentStart
    }

    // inside sentence
    if (localWordStart >= cursor && localWordStart !== -1 && localWordEnd <= localSentEnd) {
      if (localWordStart > cursor) addHighlight(cleaned.slice(cursor, localWordStart), false)
      addHighlight(cleaned.slice(localWordStart, localWordEnd), true)
      if (localWordEnd < localSentEnd) addHighlight(cleaned.slice(localWordEnd, localSentEnd), false)
    } else {
      addHighlight(cleaned.slice(cursor, localSentEnd), false)
    }

    // after sentence
    if (localSentEnd < cleaned.length) {
      addText(cleaned.slice(localSentEnd))
    }

    tn.parentNode?.replaceChild(frag, tn)
  }
}

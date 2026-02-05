import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

export function cleanForSpeech(text: string) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
    .replace(/\s+/g, " ")    // Collapse multiple spaces/newlines
    .trim();
}

function mapLessonImageSrc(src: string) {
  if (!src) return ""
  const fileName = src.split("/").pop()?.split("?")[0]
  if (!fileName) return src
  return `/leren-images/${fileName}`
}

/**
 * Very basic HTML to InhoudBlok converter for legacy lessons
 */
export function htmlToBlocks(html: string): any[] {
  const blocks: any[] = []

  const tokenRegex = /(<img[\s\S]*?>)|(<ul[\s\S]*?<\/ul>)|(<h[1-6][\s\S]*?<\/h[1-6]>)|(<p[\s\S]*?<\/p>)|(<blockquote[\s\S]*?<\/blockquote>)/gi
  const tokens = html.match(tokenRegex) || []

  tokens.forEach((token) => {
    if (token.startsWith("<img")) {
      const srcMatch = token.match(/src=["']([^"']+)["']/i)
      const altMatch = token.match(/alt=["']([^"']*)["']/i)
      const rawSrc = srcMatch?.[1] || ""
      const mappedSrc = mapLessonImageSrc(rawSrc)

      if (mappedSrc) {
        blocks.push({
          type: "afbeelding",
          bron: mappedSrc,
          bijschrift: altMatch?.[1] || "",
        })
      }
      return
    }

    if (token.startsWith("<ul")) {
      const itemRegex = /<li>([\s\S]*?)<\/li>/g
      const items: string[] = []
      let itemMatch
      while ((itemMatch = itemRegex.exec(token)) !== null) {
        items.push(itemMatch[1].replace(/<[^>]*>/g, "").trim())
      }
      if (items.length > 0) {
        blocks.push({
          type: "lijst",
          items,
        })
      }
      return
    }

    const text = token.replace(/<[^>]*>/g, "").trim()
    if (text) {
      blocks.push({
        type: "paragraaf",
        tekst: text,
      })
    }
  })

  if (blocks.length === 0) {
    return [{ type: "paragraaf", tekst: html.replace(/<[^>]*>/g, "").trim() }]
  }

  return blocks
}

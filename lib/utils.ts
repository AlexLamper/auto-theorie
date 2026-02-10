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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content)
}

export function formatLessonContent(content: string) {
  if (!content) return ""
  if (looksLikeHtml(content)) return content

  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())

  const blocks: string[] = []
  let i = 0

  const nextNonEmpty = (start: number) => {
    for (let j = start; j < lines.length; j += 1) {
      if (lines[j]) return j
    }
    return -1
  }

  while (i < lines.length) {
    if (!lines[i]) {
      i += 1
      continue
    }

    const line = lines[i]
    const prevEmpty = i === 0 || !lines[i - 1]
    const nextIndex = nextNonEmpty(i + 1)
    const nextLine = nextIndex !== -1 ? lines[nextIndex] : ""

    if (prevEmpty && line.length <= 80 && !line.endsWith(".") && nextLine) {
      blocks.push(`<h2>${escapeHtml(line)}</h2>`)
      i += 1
      continue
    }

    if (line.endsWith(":") && nextLine) {
      blocks.push(`<p>${escapeHtml(line)}</p>`)
      const items: string[] = []
      i += 1
      while (i < lines.length && lines[i]) {
        items.push(lines[i])
        i += 1
      }

      if (items.length > 0) {
        const listItems = items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")
        blocks.push(`<ul>${listItems}</ul>`)
      }
      continue
    }

    let paragraph = line
    i += 1
    while (i < lines.length && lines[i]) {
      paragraph = `${paragraph} ${lines[i]}`
      i += 1
    }

    blocks.push(`<p>${escapeHtml(paragraph)}</p>`)
  }

  return blocks.join("\n")
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
export function htmlToBlocks(html: string): Record<string, any>[] {
  const blocks: Record<string, any>[] = []

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

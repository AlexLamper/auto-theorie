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

/**
 * Very basic HTML to InhoudBlok converter for legacy lessons
 */
export function htmlToBlocks(html: string): any[] {
  console.log("[utils/htmlToBlocks] Converting HTML to blocks, length:", html.length);
  const blocks: any[] = [];
  
  // Use a simple regex approach for basic tags found in the lesson JSON
  // (h2, p, ul/li, blockquote)
  
  // 1. Handle paragraphs/headers/quotes - Match tags NOT inside a list
  const groupRegex = /<(h[1-6]|p|blockquote)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = groupRegex.exec(html)) !== null) {
      blocks.push({
          type: 'paragraaf',
          tekst: match[2].replace(/<[^>]*>/g, "").trim()
      });
  }
  
  // 2. Handle lists
  const listRegex = /<ul>([\s\S]*?)<\/ul>/g;
  while ((match = listRegex.exec(html)) !== null) {
      const itemRegex = /<li>([\s\S]*?)<\/li>/g;
      const items: string[] = [];
      let itemMatch;
      while ((itemMatch = itemRegex.exec(match[1])) !== null) {
          items.push(itemMatch[1].replace(/<[^>]*>/g, "").trim());
      }
      blocks.push({
          type: 'lijst',
          items
      });
  }
  
  console.log("[utils/htmlToBlocks] Resulting blocks:", blocks.length);
  return blocks.length > 0 ? blocks : [{ type: 'paragraaf', tekst: html.replace(/<[^>]*>/g, "").trim() }];
}

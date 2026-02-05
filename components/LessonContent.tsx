import { HighlightableText } from "./HighlightableText"
import { cleanForSpeech } from "@/lib/utils"

export interface InhoudBlok {
  type: "paragraaf" | "afbeelding" | "lijst"
  tekst?: string
  bron?: string
  bijschrift?: string
  items?: string[]
}

interface Props {
  inhoud: InhoudBlok[]
}

export default function LessonContent({ inhoud }: Props) {
  const placeholderSvg =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSIzMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgc3R5bGU9ImZvbnQtc2l6ZToxNnB4O2ZvbnQtZmFtaWx5OkFyaWFsLHNhbnMtc2VyaWYiPkFmYmVlbGRpbmcgbmlldCBnZXZvbmRlbjwvdGV4dD48L3N2Zz4="

  const spokenText = cleanForSpeech(inhoud
    .map(b => {
      if (b.type === "paragraaf") return b.tekst || "";
      if (b.type === "lijst") return b.items?.join(". ") || "";
      return "";
    })
    .filter(t => t.length > 0)
    .join(" "));

  let lastFoundIndex = 0;

  return (
    <div className="space-y-6">
      {inhoud.map((blok, i) => {
        let rawText = "";
        if (blok.type === "paragraaf") rawText = blok.tekst || "";
        else if (blok.type === "lijst") rawText = blok.items?.join(". ") || "";
        
        const cleanBlockText = cleanForSpeech(rawText);
        let blockOffset = -1;
        
        if (cleanBlockText) {
          blockOffset = spokenText.indexOf(cleanBlockText, lastFoundIndex);
          if (blockOffset !== -1) {
            lastFoundIndex = blockOffset + cleanBlockText.length;
          }
        }

        switch (blok.type) {
          case "paragraaf":
            return (
              <p key={i} className="text-muted-foreground leading-relaxed">
                <HighlightableText text={blok.tekst || ""} offset={blockOffset} />
              </p>
            )

          case "afbeelding":
            return (
              <div key={i} className="text-center">
                <img
                  src={blok.bron || placeholderSvg}
                  alt={blok.bijschrift || "Afbeelding"}
                  className="mx-auto max-w-full rounded-2xl border border-border shadow-sm"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = placeholderSvg
                  }}
                />
                {blok.bijschrift && (
                  <p className="text-sm text-muted-foreground mt-2">{blok.bijschrift}</p>
                )}
              </div>
            )

          case "lijst":
            return (
              <ul key={i} className="list-disc list-inside space-y-1 text-muted-foreground">
                {blok.items?.map((item, j) => {
                   let itemOffset = -1;
                   const cleanItemText = cleanForSpeech(item);
                   if (blockOffset !== -1 && cleanItemText) {
                     itemOffset = spokenText.indexOf(cleanItemText, blockOffset);
                   }
                   
                   return (
                    <li key={j}>
                      <HighlightableText text={item} offset={itemOffset} />
                    </li>
                   )
                })}
              </ul>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

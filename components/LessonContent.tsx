import { HighlightableText } from "./HighlightableText"
import { FallbackImage } from "@/components/ui/fallback-image"

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

  return (
    <div className="space-y-6">
      {inhoud.map((blok, i) => {
        switch (blok.type) {
          case "paragraaf":
            return (
              <p key={i} className="text-muted-foreground leading-relaxed">
                <HighlightableText text={blok.tekst || ""} />
              </p>
            )

          case "afbeelding":
            return (
              <div key={i} className="text-center">
                <div className="relative aspect-video w-full mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border shadow-sm bg-slate-50 dark:bg-slate-900/50">
                  <FallbackImage
                    src={blok.bron || placeholderSvg}
                    fallbackSrc={placeholderSvg}
                    alt={blok.bijschrift || "Afbeelding"}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain p-2"
                  />
                </div>
                {blok.bijschrift && (
                  <p className="text-sm text-muted-foreground mt-2 italic">{blok.bijschrift}</p>
                )}
              </div>
            )

          case "lijst":
            return (
              <ul key={i} className="list-disc list-inside space-y-1 text-muted-foreground">
                {blok.items?.map((item, j) => (
                  <li key={j}>
                    <HighlightableText text={item} />
                  </li>
                ))}
              </ul>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

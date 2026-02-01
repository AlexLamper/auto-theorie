import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongodb"
import Lesson from "@/models/Lesson"

const AUTO_TOPICS = [
  { slug: "milieu", title: "Verantwoord en milieubewust rijden", order: 1 },
  { slug: "verkeersborden", title: "Verkeersborden en verkeersregelaars", order: 2 },
  { slug: "verkeersregels", title: "Verkeersregels, snelheden en parkeren", order: 3 },
  { slug: "veiligheid", title: "Verkeersveiligheid", order: 4 },
  { slug: "voorrang", title: "Voorrang en voor laten gaan", order: 5 },
  { slug: "weggebruikers", title: "Andere weggebruikers", order: 6 },
  { slug: "voertuig", title: "Het voertuig", order: 7 },
  { slug: "verkeerswetten", title: "Wetgeving en documenten", order: 8 },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categorie = searchParams.get("categorie")

    await connectMongoDB()

    if (categorie) {
      // Zoek lessen voor deze categorie (versie met string 'category')
      let lessons = await Lesson.find({ category: categorie }).sort({ order: 1 }).lean()
      
      // Fallback voor oude data die nog categoryId gebruikt
      if (lessons.length === 0) {
        // Hier zouden we normaal gesproken de categoryId moeten opzoeken, 
        // maar de user wil de Category model weg.
        // We proberen lessen te vinden waar 'category' (string) gelijk is aan de slug
        lessons = await Lesson.find({ category: categorie }).sort({ order: 1 }).lean()
      }

      if (lessons.length === 0) {
        return NextResponse.json({ error: "Geen lessen gevonden." }, { status: 404 })
      }

      return NextResponse.json(lessons)
    }

    // Geen categorie? Geef de hardcoded lijst van auto onderwerpen
    return NextResponse.json(AUTO_TOPICS)
  } catch (error) {
    console.error("Leren API Error:", error)
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 })
  }
}

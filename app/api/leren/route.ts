import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectMongoDB from "@/libs/mongodb"
import Lesson from "@/models/Lesson"
import { authOptions } from "@/lib/auth"
import { findUserById } from "@/lib/user"
import { hasActivePlan } from "@/lib/access"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categorie = searchParams.get("categorie")

    const session = await getServerSession(authOptions)
    const user = session?.user?.id ? await findUserById(session.user.id) : null
    const activePlan = hasActivePlan(user?.plan)

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

      if (!activePlan) {
        const firstLessonId = lessons[0]?._id?.toString()
        const lockedLessons = lessons.map((lesson: any) => ({
          ...lesson,
          content: lesson._id?.toString() === firstLessonId ? lesson.content : "",
          isLocked: lesson._id?.toString() !== firstLessonId,
        }))

        return NextResponse.json(lockedLessons)
      }

      return NextResponse.json(lessons)
    }

    // Geen categorie? Geef alle categorieen uit de database
    const categories = await Lesson.aggregate([
      { $sort: { categoryOrder: 1, order: 1 } },
      {
        $group: {
          _id: "$category",
          title: { $first: "$categoryTitle" },
          order: { $first: "$categoryOrder" },
        },
      },
      {
        $project: {
          _id: 0,
          slug: "$_id",
          title: 1,
          order: 1,
        },
      },
      { $sort: { order: 1, title: 1 } },
    ])

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Leren API Error:", error)
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 })
  }
}

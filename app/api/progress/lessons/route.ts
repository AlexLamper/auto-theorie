import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectMongoDB from "@/libs/mongodb"
import Lesson from "@/models/Lesson"
import UserProgress from "@/models/UserProgress"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({
      authenticated: false,
      completedLessonIds: [],
      completedCategories: [],
      completedLessonsCount: 0,
      totalLessonsCount: 0,
    })
  }

  await connectMongoDB()

  const lessons = await Lesson.find({}, { category: 1 }).lean()
  const progress = await UserProgress.find(
    { userId: session.user.id, completed: true },
    { lessonId: 1 }
  ).lean()

  const completedLessonIds = progress.map((item) => item.lessonId.toString())
  const totalLessonsCount = lessons.length
  const completedLessonsCount = completedLessonIds.length

  const totalsByCategory = new Map<string, number>()
  const completedByCategory = new Map<string, number>()
  const lessonCategoryById = new Map<string, string>()

  lessons.forEach((lesson: any) => {
    const id = lesson._id.toString()
    lessonCategoryById.set(id, lesson.category)
    totalsByCategory.set(lesson.category, (totalsByCategory.get(lesson.category) ?? 0) + 1)
  })

  progress.forEach((item: any) => {
    const category = lessonCategoryById.get(item.lessonId.toString())
    if (!category) return
    completedByCategory.set(category, (completedByCategory.get(category) ?? 0) + 1)
  })

  const completedCategories: string[] = []
  totalsByCategory.forEach((total, category) => {
    if ((completedByCategory.get(category) ?? 0) >= total) {
      completedCategories.push(category)
    }
  })

  return NextResponse.json({
    authenticated: true,
    completedLessonIds,
    completedCategories,
    completedLessonsCount,
    totalLessonsCount,
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Niet ingelogd" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : null

  if (!lessonId) {
    return NextResponse.json({ message: "lessonId ontbreekt" }, { status: 400 })
  }

  await connectMongoDB()

  await UserProgress.updateOne(
    { userId: session.user.id, lessonId },
    {
      $set: {
        completed: true,
        completedAt: new Date(),
      },
    },
    { upsert: true }
  )

  return NextResponse.json({ ok: true })
}

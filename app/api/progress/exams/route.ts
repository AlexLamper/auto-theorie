import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectMongoDB from "@/libs/mongodb"
import UserExamAttempt from "@/models/UserExamAttempt"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Niet ingelogd" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const examSlug = typeof body.examSlug === "string" ? body.examSlug : null

  if (!examSlug) {
    return NextResponse.json({ message: "examSlug ontbreekt" }, { status: 400 })
  }

  const score = typeof body.score === "number" ? body.score : undefined
  const passed = typeof body.passed === "boolean" ? body.passed : undefined
  const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : undefined

  await connectMongoDB()

  await UserExamAttempt.create({
    userId: session.user.id,
    examSlug,
    score,
    passed,
    durationSeconds,
  })

  return NextResponse.json({ ok: true })
}

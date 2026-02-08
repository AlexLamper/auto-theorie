import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectMongoDB from "@/libs/mongodb"
import UserExamAttempt from "@/models/UserExamAttempt"
import { findUserById } from "@/lib/user"
import { getExamLimit, hasActivePlan } from "@/lib/access"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({
      authenticated: false,
      hasActivePlan: false,
      examAttemptsUsed: 0,
      examAttemptsLimit: 1,
      lessonAccessMaxOrder: 1,
    })
  }

  const user = await findUserById(session.user.id)
  const plan = user?.plan
  const active = hasActivePlan(plan)
  const examLimit = getExamLimit(plan?.name, active, user?.examLimit || 0)

  await connectMongoDB()

  const query: Record<string, any> = { userId: session.user.id }
  if (active && plan?.startedAt && plan?.expiresAt) {
    query.createdAt = {
      $gte: new Date(plan.startedAt),
      $lte: new Date(plan.expiresAt),
    }
  }

  const attempts = await UserExamAttempt.countDocuments(query)

  return NextResponse.json({
    authenticated: true,
    hasActivePlan: active,
    planLabel: plan?.label ?? null,
    planExpiresAt: plan?.expiresAt ?? null,
    examAttemptsUsed: attempts,
    examAttemptsLimit: examLimit,
    remainingExams: Math.max(0, examLimit - attempts),
    lessonAccessMaxOrder: active ? null : 1,
  })
}

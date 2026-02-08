import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectMongoDB from "@/libs/mongodb"
import Question from "@/models/Question"
import UserExamAttempt from "@/models/UserExamAttempt"
import { findUserById } from "@/lib/user"
import { getExamLimit, hasActivePlan } from "@/lib/access"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectMongoDB()
  
  // Check limit
  const user = await findUserById(session.user.id)
  const plan = user?.plan
  const active = hasActivePlan(plan)
  const examLimit = getExamLimit(plan?.name, active, user?.examLimit || 0)
  
  const query: Record<string, any> = { userId: session.user.id }
  if (active && plan?.startedAt && plan?.expiresAt) {
    query.createdAt = {
      $gte: new Date(plan.startedAt),
      $lte: new Date(plan.expiresAt),
    }
  }

  const attemptsUsed = await UserExamAttempt.countDocuments(query)

  if (attemptsUsed >= examLimit) {
    return NextResponse.json({ message: "Je hebt je maximale aantal examens bereikt. Koop extra examens om door te gaan." }, { status: 403 })
  }

  // Create attempt record immediately
  const generatedSlug = `generated-${Date.now()}`
  const attempt = new UserExamAttempt({
    userId: session.user.id,
    examSlug: generatedSlug,
    createdAt: new Date()
  })
  await attempt.save()

  // Generate random questions (Total 65)
  // 25 Gevaarherkenning
  const dangerQuestions = await Question.aggregate([
    { $match: { category: "Gevaarherkenning" } },
    { $sample: { size: 25 } }
  ])
  
  // 40 Theory (Kennis + Inzicht)
  const theoryQuestions = await Question.aggregate([
    { $match: { category: { $ne: "Gevaarherkenning" } } },
    { $sample: { size: 40 } }
  ])

  let questions = [...dangerQuestions, ...theoryQuestions]
  
  // Fill up if not enough
  if (questions.length < 65) {
     const needed = 65 - questions.length;
     const extra = await Question.aggregate([
        { $match: { _id: { $nin: questions.map(q => q._id) } } },
        { $sample: { size: needed } }
     ])
     questions = [...questions, ...extra]
  }

  // Transform to StartExamPage format
  const mappedQuestions = questions.map(q => {
      // Map correctAnswer index to one-hot array or similar if needed
      // StartExamPage logic: q.correct_answer_indices[answer] === 1
      const indices = Array(q.options.length).fill(0)
      
      // Ensure correctAnswer is valid
      if (typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < indices.length) {
          indices[q.correctAnswer] = 1
      }
      
      return {
          question_text: q.question,
          answers: q.options,
          correct_answer_indices: indices, // [0, 1, 0] or similar
          explanation: q.explanation,
          image: q.image || null, // Pass image if it exists in doc (even if not in schema def)
          category: q.category
      }
  })

  return NextResponse.json({
      exam: {
          title: "Credit Examen (Willekeurig)",
          questions: mappedQuestions,
          exam_id: "credit_" + Date.now()
      }
  })
}

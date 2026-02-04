import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongodb"
import Question from "@/models/Question"

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category") || "auto"
    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size: 40 } },
    ])
    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error fetching exam questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB()
    const data = await req.json()
    const question = new Question(data)
    await question.save()
    return NextResponse.json({ question }, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongodb"
import Exam from "@/models/Exam"
import { getExams } from "@/lib/exams"

export async function GET(req: NextRequest) {
  try {
    const exams = await getExams()
    return NextResponse.json({ exams })
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectMongoDB()
    const data = await req.json()
    const exam = new Exam(data)
    await exam.save()
    return NextResponse.json({ exam }, { status: 201 })
  } catch (error) {
    console.error("Error creating exam:", error)
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 })
  }
}
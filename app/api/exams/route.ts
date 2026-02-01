import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/libs/mongodb"
import Exam from "@/models/Exam"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  try {
    try {
      await connectMongoDB()
      // Forceer numerieke sortering in MongoDB en zorg dat exam_id geselecteerd is
      const exams = await Exam.find({}).sort({ exam_id: 1 }).select("exam_id title slug created_at").lean()
      if (exams && exams.length > 0) {
        // Dubbel check sortering in JS voor de zekerheid
        const sortedExams = exams.sort((a: any, b: any) => Number(a.exam_id) - Number(b.exam_id))
        return NextResponse.json({ exams: sortedExams })
      }
    } catch (dbError) {
      console.error("Database connection failed, using local fallback:", dbError)
    }

    // Fallback naar local JSON
    const filePath = path.join(process.cwd(), "docs", "exams.json")
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8")
      const rawExams = JSON.parse(fileData)
      
      const exams = rawExams
        .map((e: any) => ({
          exam_id: Number(e.exam_id), // Forceer Number
          title: e.title,
          slug: e.slug,
          created_at: e.created_at
        }))
        // Robuuste numerieke sortering
        .sort((a: any, b: any) => a.exam_id - b.exam_id)
        
      console.log("[API] Sorted exams sample:", exams.slice(0, 3).map(e => e.exam_id))
      return NextResponse.json({ exams })
    }

    return NextResponse.json({ exams: [] })
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
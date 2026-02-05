import connectMongoDB from "@/libs/mongodb"
// @ts-ignore
import Exam from "@/models/Exam"
import fs from "fs"
import path from "path"

export async function getExams() {
  try {
    try {
      await connectMongoDB()
      // Forceer numerieke sortering in MongoDB en zorg dat exam_id geselecteerd is
      const exams = await Exam.find({}).sort({ exam_id: 1 }).select("exam_id title slug created_at").lean()
      if (exams && exams.length > 0) {
        // Dubbel check sortering in JS voor de zekerheid, converteer _id en andere velden indien nodig naar plain objects
        return exams.sort((a: any, b: any) => Number(a.exam_id) - Number(b.exam_id))
          .map((exam: any) => ({
            ...exam,
            _id: exam._id.toString(),
            created_at: exam.created_at ? new Date(exam.created_at).toISOString() : null,
            updatedAt: exam.updatedAt ? new Date(exam.updatedAt).toISOString() : null
          }))
      }
    } catch (dbError) {
      console.error("Database connection failed during getExams, using local fallback:", dbError)
    }

    // Fallback naar local JSON
    const filePath = path.join(process.cwd(), "docs", "oefenexamens.json")
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
        
      return exams
    }

    return []
  } catch (error) {
    console.error("Error in getExams:", error)
    return []
  }
}

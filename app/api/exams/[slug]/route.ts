import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Exam from "@/models/Exam";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Check local fallback FIRST for instant loading
    const filePath = path.join(process.cwd(), "docs", "exams.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      const allExams = JSON.parse(fileData);
      const exam = allExams.find((e: any) => e.slug === slug);
      
      if (exam) {
        return NextResponse.json({ exam });
      }
    }

    // Attempt DB connection in background or as second choice if not in local
    try {
      await connectMongoDB();
      const exam = await Exam.findOne({ slug });

      if (exam) {
        return NextResponse.json({ exam });
      }
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
    }

    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
  }
}

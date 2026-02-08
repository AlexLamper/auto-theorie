import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectMongoDB from "@/libs/mongodb";
import Exam from "@/models/Exam";
import UserExamAttempt from "@/models/UserExamAttempt";
import fs from "fs";
import path from "path";
import { authOptions } from "@/lib/auth";
import { findUserById } from "@/lib/user";
import { getExamLimit, hasActivePlan } from "@/lib/access";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Allow the first exam for everyone
    if (slug !== "oefenexamen-auto-1") {
      if (!userId) {
        return NextResponse.json({ message: "Log in om een examen te starten." }, { status: 401 });
      }

      const user = await findUserById(userId);
      const active = hasActivePlan(user?.plan);
      
      if (!active) {
         return NextResponse.json(
           { message: "Kies een pakket om toegang te krijgen tot alle examens." },
           { status: 403 }
         );
      }

      const examLimit = getExamLimit(user?.plan?.name, active, user?.examLimit || 0)

      await connectMongoDB();

      const attemptQuery: Record<string, any> = { userId };
      if (active && user?.plan?.startedAt && user?.plan?.expiresAt) {
        attemptQuery.createdAt = {
          $gte: new Date(user.plan.startedAt),
          $lte: new Date(user.plan.expiresAt),
        };
      }

      const attemptCount = await UserExamAttempt.countDocuments(attemptQuery);
      if (attemptCount >= examLimit) {
        return NextResponse.json(
          { message: "Je examens zijn op. Koop extra pogingen om verder te gaan." },
          { status: 402 }
        );
      }
    }

    // Check local fallback FIRST for instant loading
    const filePath = path.join(process.cwd(), "docs", "oefenexamens.json");
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

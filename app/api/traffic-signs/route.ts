import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongoose"
import TrafficSign from "@/models/TrafficSign"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    try {
      await connectDB()
      const trafficSigns = await TrafficSign.find().lean()
      return NextResponse.json({ trafficSigns })
    } catch (dbError) {
      console.error("Database error, falling back to local storage:", dbError)
      
      const filePath = path.join(process.cwd(), "docs", "trafficsigns.json")
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf-8")
        const trafficSigns = JSON.parse(fileData)
        return NextResponse.json({ trafficSigns, source: "local" })
      }
      
      throw dbError
    }
  } catch (error) {
    console.error("Error fetching traffic signs:", error)
    return NextResponse.json({ error: "Failed to fetch traffic signs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const trafficSign = new TrafficSign(data);
    await trafficSign.save();
    return NextResponse.json({ trafficSign }, { status: 201 });
  } catch (error) {
    console.error("Error creating traffic sign:", error);
    return NextResponse.json({ error: "Failed to create traffic sign" }, { status: 500 });
  }
}

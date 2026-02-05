import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const contentTypeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
}

import type { NextRequest } from "next/server"
// Use Next.js RouteContext type for params
type RouteContext = { params: Promise<{ image: string }> }
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { image } = await context.params
    const fileName = image
    const filePath = path.join(process.cwd(), "data", "leren", "images", fileName)
    const file = await fs.readFile(filePath)
    const ext = path.extname(fileName).toLowerCase()
    const contentType = contentTypeByExt[ext] || "application/octet-stream"

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Afbeelding niet gevonden" }, { status: 404 })
  }
}

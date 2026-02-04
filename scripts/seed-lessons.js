const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

const LessonSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    categoryTitle: { type: String, required: true },
    categoryOrder: { type: Number, default: 0 },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "lessons",
  }
)

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema)

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

async function seedLessons() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI ontbreekt in .env.local")
  }

  await mongoose.connect(MONGODB_URI, { dbName: "auto-theorie" })

  const lessonsDir = path.join(__dirname, "..", "data", "leren", "text")
  const files = fs.readdirSync(lessonsDir).filter((file) => file.endsWith(".json"))

  const allLessons = []

  for (const file of files) {
    const filePath = path.join(lessonsDir, file)
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))

    const categoryTitle = raw.title || file.replace(/\.json$/i, "")
    const categorySlug = slugify(categoryTitle)
    const categoryOrder = Number(raw.chapter_number) || 0

    if (!Array.isArray(raw.pages)) {
      continue
    }

    for (const page of raw.pages) {
      const pageNumber = Number(page.page_number) || 0
      const pageTitle = page.title || `${categoryTitle} - Pagina ${pageNumber}`

      allLessons.push({
        category: categorySlug,
        categoryTitle,
        categoryOrder,
        slug: `${categorySlug}-pagina-${pageNumber || allLessons.length + 1}`,
        title: pageTitle,
        content: page.html || "",
        order: pageNumber,
      })
    }
  }

  await Lesson.deleteMany({})
  if (allLessons.length > 0) {
    await Lesson.insertMany(allLessons)
  }

  console.log(`Seeded ${allLessons.length} lessons.`)
  await mongoose.disconnect()
}

seedLessons().catch((error) => {
  console.error("Seed lessons failed:", error)
  process.exit(1)
})

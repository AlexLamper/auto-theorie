const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

const TrafficSignSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    hoverHint: { type: String },
  },
  {
    timestamps: true,
    collection: "trafficsigns",
  }
)

const TrafficSign = mongoose.models.TrafficSign || mongoose.model("TrafficSign", TrafficSignSchema)

async function seedTrafficSigns() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI ontbreekt in .env.local")
  }

  await mongoose.connect(MONGODB_URI, { dbName: "auto-theorie" })

  const filePath = path.join(__dirname, "..", "data", "traffic_signs_data.json")
  const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"))

  const imageDir = path.join(__dirname, "..", "public", "images", "verkeersborden")
  const files = fs.readdirSync(imageDir)

  const signs = []
  let counter = 1

  for (const catGroup of rawData) {
    for (const sign of catGroup.signs) {
      // Find the file that starts with the current counter
      const fileName = files.find(f => f.startsWith(`${counter}_`))
      
      if (!fileName) {
        console.warn(`Warning: No image file found for counter ${counter} (${sign.description})`)
      }

      signs.push({
        description: sign.description,
        category: catGroup.category,
        image: fileName ? `/images/verkeersborden/${fileName}` : "",
        hoverHint: sign.hoverHint || ""
      })
      counter++
    }
  }

  await TrafficSign.deleteMany({})
  if (signs.length > 0) {
    await TrafficSign.insertMany(signs)
  }

  console.log(`✅ Seeded ${signs.length} traffic signs into 'trafficsigns' collection.`)
  await mongoose.disconnect()
}

seedTrafficSigns().catch((error) => {
  console.error("Seed traffic signs failed:", error)
  process.exit(1)
})

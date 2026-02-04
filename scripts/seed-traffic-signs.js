const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

const TrafficSignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    meaning: { type: String, required: true },
    category: [{ type: String, required: true }],
    type: { type: String, required: true },
    shape: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    applicableFor: [{ type: String, required: true }],
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

  const filePath = path.join(__dirname, "..", "docs", "trafficsigns.json")
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"))

  const signs = raw.map((sign) => {
    const { _id, createdAt, updatedAt, ...rest } = sign
    return rest
  })

  await TrafficSign.deleteMany({})
  if (signs.length > 0) {
    await TrafficSign.insertMany(signs)
  }

  console.log(`Seeded ${signs.length} traffic signs.`)
  await mongoose.disconnect()
}

seedTrafficSigns().catch((error) => {
  console.error("Seed traffic signs failed:", error)
  process.exit(1)
})

import mongoose from "mongoose"

const schemaName = "Lesson"

const LessonSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
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

export default mongoose.models[schemaName] || mongoose.model(schemaName, LessonSchema)

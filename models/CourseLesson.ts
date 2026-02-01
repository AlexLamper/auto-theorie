import mongoose, { Schema, type Document, Types } from "mongoose"

export interface CourseLessonDocument extends Document {
  category: string
  slug: string
  title: string
  content: string
  image?: string
  order?: number
}

const CourseLessonSchema = new Schema<CourseLessonDocument>({
  category: { type: String, required: true, index: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  order: { type: Number, default: 0 },
})

CourseLessonSchema.index({ category: 1 })

export default mongoose.models.CourseLesson || mongoose.model<CourseLessonDocument>("CourseLesson", CourseLessonSchema)
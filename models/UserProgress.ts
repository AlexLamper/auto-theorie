import mongoose, { Schema, type Document, Types } from "mongoose"

export interface UserProgressDocument extends Document {
  userId: string
  sessionId?: string
  lessonId: Types.ObjectId
  completed: boolean
  completedAt?: Date
}

const UserProgressSchema = new Schema<UserProgressDocument>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String },
  lessonId: { type: Schema.Types.ObjectId, ref: "CourseLesson", required: true, index: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
})

UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })

export default mongoose.models.UserProgress || mongoose.model<UserProgressDocument>("UserProgress", UserProgressSchema)
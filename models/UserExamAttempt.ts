import mongoose, { Schema, type Document } from "mongoose"

export interface UserExamAttemptDocument extends Document {
  userId: string
  examSlug: string
  score?: number
  passed?: boolean
  durationSeconds?: number
  createdAt: Date
}

const UserExamAttemptSchema = new Schema<UserExamAttemptDocument>(
  {
    userId: { type: String, required: true, index: true },
    examSlug: { type: String, required: true, index: true },
    score: { type: Number },
    passed: { type: Boolean },
    durationSeconds: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "user_exam_attempts" }
)

UserExamAttemptSchema.index({ userId: 1, createdAt: 1 })

export default mongoose.models.UserExamAttempt ||
  mongoose.model<UserExamAttemptDocument>("UserExamAttempt", UserExamAttemptSchema)

import mongoose, { Schema } from "mongoose"

const schemaName = "Exam"

const QuestionSchema = new Schema({
  index: { type: Number, required: true },
  question_text: { type: String, required: true },
  answers: [{ type: String }],
  correct_answer_indices: [{ type: Schema.Types.Mixed }],
  correct_answer_raw: { type: Schema.Types.Mixed },
  image: { type: String },
  explanation: { type: String },
})

const ExamSchema = new mongoose.Schema(
  {
    exam_id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    questions: [QuestionSchema],
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "oefenexamens",
  }
)

export default mongoose.models[schemaName] || mongoose.model(schemaName, ExamSchema)

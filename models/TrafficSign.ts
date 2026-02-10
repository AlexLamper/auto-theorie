import mongoose from "mongoose"

const schemaName = "TrafficSign"

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

export default mongoose.models[schemaName] || mongoose.model(schemaName, TrafficSignSchema)

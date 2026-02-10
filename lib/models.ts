import mongoose from "mongoose";


export interface TrafficSignType {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  meaning: string;
  category: string;
  type: string;
  shape: string;
  color: string;
  image: string;
  applicableFor: string[];
  createdAt: Date;
  updatedAt: Date;
}

const trafficSignSchema = new mongoose.Schema<TrafficSignType>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  shape: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  applicableFor: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export const TrafficSign = mongoose.models.TrafficSign || mongoose.model('TrafficSign', trafficSignSchema);
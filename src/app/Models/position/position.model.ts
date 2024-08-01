import { model, Schema } from "mongoose";
import { TPosition } from "./position.interface";

const positionSchema = new Schema<TPosition>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "ongoing", "terminated", "completed"],
      default: "pending",
      required: true,
    },
    terminationMessage: { type: String },
    maxVotes: { type: Number, required: true },
    maxCandidate: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Position = model<TPosition>("Position", positionSchema);

import { model, Schema } from "mongoose";
import { PositionModel, TPosition } from "./position.interface";

const positionSchema = new Schema<TPosition, PositionModel>(
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

positionSchema.statics.isPositionDeleted = async function (id: string) {
  return await Position.findById(id, { isDeleted: true });
};
positionSchema.statics.isPositionExists = async function (id: string) {
  return await Position.findById(id);
};
export const Position = model<TPosition, PositionModel>(
  "Position",
  positionSchema
);

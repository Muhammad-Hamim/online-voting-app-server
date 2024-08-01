import { model, Schema } from "mongoose";
import { TCandidate } from "./candidate.interface";

const candidateSchema = new Schema<TCandidate>(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    position: {
      type: Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    votes: { type: Number, default: 0, required: true },
    status: {
      type: String,
      enum: ["applied", "approved", "rejected"],
      default: "applied",
    },
    photo: { type: String, required: false },
    message: { type: String, required: false },
  },
  { timestamps: true }
);

export const Candidate = model<TCandidate>("Candidate", candidateSchema);

import { model, Schema } from "mongoose";
import { TCandidate, TPosition, TPVote } from "./position.interface";

const candidateSchema = new Schema<TCandidate>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["applied", "approved", "rejected"],
    default: "applied",
    required: true,
  },
});

const voteSchema = new Schema<TPVote>({
  voterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votedAt: { type: Date, default: Date.now },
});

const positionSchema = new Schema<TPosition>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
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
  candidates: [candidateSchema],
  votes: [voteSchema],
});

export const Position = model<TPosition>("Position", positionSchema);

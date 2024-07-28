import { model, Schema } from "mongoose";
import { TAppliedPosition, TUser, TVote } from "./user.interface";

const appliedPositionSchema = new Schema<TAppliedPosition>({
  positionId: { type: Schema.Types.ObjectId, ref: "Position", required: true },
  status: {
    type: String,
    enum: ["applied", "approved", "rejected"],
    default: "applied",
  },
  appliedAt: { type: Date, default: Date.now },
});
const voteSchema = new Schema<TVote>({
  positionId: { type: Schema.Types.ObjectId, ref: "Position", required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  votedAt: { type: Date, default: Date.now },
});
const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  photo: { type: String, required: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  appliedPositions: [appliedPositionSchema],
  votes: [voteSchema],
});

export const User = model<TUser>("User", userSchema);

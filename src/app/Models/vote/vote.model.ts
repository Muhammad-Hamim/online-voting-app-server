import { model, Schema } from "mongoose";
import { TVote } from "./vote.interface";

const votesSchema = new Schema<TVote>(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    position: {
      type: Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
  },
  { timestamps: true }
);

export const Vote = model<TVote>("Vote", votesSchema);

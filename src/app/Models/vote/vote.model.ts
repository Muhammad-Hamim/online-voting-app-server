import { model, Schema } from "mongoose";
import { TVote, VotesModel } from "./vote.interface";

const votesSchema = new Schema<TVote, VotesModel>(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
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

votesSchema.statics.isUserAlreadyVoted = async function (
  voter: string,
  position: string
) {
  return await Vote.findOne({ voter, position });
};

export const Vote = model<TVote, VotesModel>("Vote", votesSchema);

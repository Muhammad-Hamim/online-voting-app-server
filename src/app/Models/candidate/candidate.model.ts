import { model, Schema } from "mongoose";
import { CandidateModel, TCandidate } from "./candidate.interface";

const candidateSchema = new Schema<TCandidate, CandidateModel>(
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

candidateSchema.statics.isCandidateExists = async function (id: string) {
  return await Candidate.findById(id);
};
candidateSchema.statics.isCandidateExistsById = async function (
  candidate: string,
  position: string
) {
  return await Candidate.findOne({ _id: candidate, position });
};

candidateSchema.statics.isCandidateAlreadyApplied = async function (
  candidate: string,
  position: string
) {
  return await Candidate.findOne({ candidate, position });
};
candidateSchema.statics.isMaxCandidateAlreadyFilled = async function (
  position: string
) {
  const appliedApprovedCandidate = await Candidate.find({
    position,
    status: "approved",
  });
  return appliedApprovedCandidate.length;
};
export const Candidate = model<TCandidate, CandidateModel>(
  "Candidate",
  candidateSchema
);

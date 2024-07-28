import { Types } from "mongoose";

export type TCandidate = {
  userId: Types.ObjectId;
  appliedAt: Date;
  status: "applied" | "approved" | "rejected";
};

export type TPVote = {
  voterId: Types.ObjectId;
  candidateId: Types.ObjectId;
  votedAt: Date;
};

export type TPosition = {
  title: string;
  description: string;
  createdAt: Date;
  endedAt?: Date;
  duration: string;
  status: "pending" | "ongoing" | "terminated" | "completed";
  terminationMessage?: string;
  maxVotes: number;
  maxCandidate: number;
  candidates: TCandidate[];
  votes: TPVote[];
};

import { Types } from "mongoose";

export type TAppliedPosition = {
  positionId: Types.ObjectId;
  appliedAt: Date;
  status: "applied" | "approved" | "rejected";
};
export type TVote = {
  positionId: Types.ObjectId;
  candidateId: Types.ObjectId;
  votedAt: Date;
};

export type TUser = {
  name: string;
  email: string;
  studentId: string;
  photo: string;
  role: "user" | "admin";
  createdAt: Date;
  status: "active" | "blocked";
  appliedPositions?: TAppliedPosition[];
  votes?: TVote[];
};

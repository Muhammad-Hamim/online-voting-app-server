import { Types } from "mongoose";

export type TCandidate = {
  candidate: Types.ObjectId;
  email: string;
  position: Types.ObjectId;
  votes:number;
  status: "applied" | "approved" | "rejected";
  photo?: string;
  message?: string;
};

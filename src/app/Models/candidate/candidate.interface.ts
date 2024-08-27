import { Model, Types } from "mongoose";
import { TUser } from "../user/user.interface";
import { TPosition } from "../position/position.interface";

export interface TCandidate {
  candidate: Types.ObjectId;
  email: string;
  position: Types.ObjectId;
  votes: number;
  status: "applied" | "approved" | "rejected";
  photo?: string;
  message?: string;
}

export interface AggregatedResult extends Partial<TCandidate> {
  positionDetails: Partial<TPosition>;
  creatorDetails: Partial<TUser>;
  voters: Partial<TUser>[];
}

export interface CandidateModel extends Model<TCandidate> {
  isCandidateExists(id: string): Promise<TCandidate | null>;
  isCandidateExistsById(
    candidate: string,
    position: string
  ): Promise<TCandidate | null>;
  isCandidateAlreadyApplied(id: string, position: string): Promise<boolean>;
  isMaxCandidateAlreadyFilled(position: string): Promise<number>;
}

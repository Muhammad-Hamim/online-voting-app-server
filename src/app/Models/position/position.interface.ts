import { Model, Types } from "mongoose";

export interface TPosition {
  title: string;
  description: string;
  status?: "pending" | "live" | "terminated" | "closed";
  terminationMessage?: string;
  maxVotes: number;
  creator: Types.ObjectId;
  maxCandidate: number;
  startTime: Date;
  endTime:Date;
  isDeleted: boolean;
}

//create static method
export interface PositionModel extends Model<TPosition> {
  isPositionDeleted(id: string): Promise<boolean>;
  isPositionExists(id: string): Promise<TPosition | null>;
}

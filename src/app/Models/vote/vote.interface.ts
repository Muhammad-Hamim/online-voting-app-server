import { Model, Types } from "mongoose";

export interface TVote {
  voter: Types.ObjectId;
  email: string;
  candidate: Types.ObjectId;
  position: Types.ObjectId;
}

export interface VotesModel extends Model<TVote> {
  isUserAlreadyVoted(voter: string, position: string): Promise<boolean>;
}

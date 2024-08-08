import { Model, Types } from "mongoose";

export interface TVote {
  voter: Types.ObjectId; //user id
  email: string;
  candidate: Types.ObjectId; // candidate collection _id
  position: Types.ObjectId; // position collection _id
}

export interface VotesModel extends Model<TVote> {
  isUserAlreadyVoted(voter: string, position: string): Promise<boolean>;
}

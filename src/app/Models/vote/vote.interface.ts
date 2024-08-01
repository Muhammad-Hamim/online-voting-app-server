import { Types } from "mongoose";

export type TVote = {
  voter: Types.ObjectId;
  email: string;
  candidate: Types.ObjectId;
  position: Types.ObjectId;
};

import { Model, Types } from "mongoose";

export interface TCandidate {
  candidate: Types.ObjectId;
  email: string;
  position: Types.ObjectId;
  votes:number;
  status: "applied" | "approved" | "rejected";
  photo?: string;
  message?: string;
};


export interface CandidateModel extends Model<TCandidate>{
  isCandidateExists(email:string):Promise<TCandidate | null>;
  isCandidateAlreadyApplied(id:string,position:string):Promise<boolean>
  isMaxCandidateAlreadyFilled(position:string):Promise<number>
}



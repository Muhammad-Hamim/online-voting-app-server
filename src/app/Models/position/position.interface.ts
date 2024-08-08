import { Model } from "mongoose";

export interface TPosition  {
  title: string;
  description: string;
  duration: string;
  status: "pending" | "ongoing" | "terminated" | "completed";
  terminationMessage?: string;
  maxVotes: number;
  maxCandidate: number;
  isDeleted:boolean;
};


//create static method
export interface PositionModel extends Model<TPosition>{
  isPositionDeleted(id:string):Promise<boolean>;
  isPositionExists(id:string):Promise<TPosition | null>;
}
import { Model } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  studentId?: string;
  photo: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  isDeleted: boolean;
};

export interface UserMethods {
  isUserExists(email: string): Promise<TUser | null>;
}


export type UserModel = Model<TUser, Record<string, never>, UserMethods>;

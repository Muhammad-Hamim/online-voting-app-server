import { Model } from "mongoose";

export interface TUser {
  name: string;
  email: string;
  studentId?: string;
  photo: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  isDeleted: boolean;
}

/*
instance method
export interface UserMethods {
  isUserExists(email: string): Promise<TUser | null>;
}
export type UserModel = Model<TUser, Record<string, never>, UserMethods>;
*/

//static method

export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser | null>;
  isUserStatusActive(email: string): Promise<boolean>;
  isUserDeleted(email: string): Promise<boolean>;
}

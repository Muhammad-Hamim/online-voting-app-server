import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  name: string;
  email: string;
  studentId?: string;
  password: string;
  passwordChangedAt?: Date;
  photo: string;
  role: "user" | "admin" | "superAdmin";
  status?: "pending" | "active" | "blocked";
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
  isPasswordMatched(
    plainTextPass: string,
    hashedPass: string
  ): Promise<boolean>;
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

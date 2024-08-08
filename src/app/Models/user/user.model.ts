import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: false, unique: true },
    photo: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//query middleware
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const user = await User.findOne({ email: this.getQuery().email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exits");
  }
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  const user = await User.findOne({ email });
  return user;
};
userSchema.statics.isUserStatusActive = async function (email: string) {
  return await User.findOne({ email, status: "active" });
};
userSchema.statics.isUserDeleted = async function (email: string) {
  return await User.findOne({ email, isDeleted: true });
};
export const User = model<TUser, UserModel>("User", userSchema);

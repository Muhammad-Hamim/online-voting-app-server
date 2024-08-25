import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true, select: false }, // Ensure password is not selected by default
    passwordChangedAt: { type: Date },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: false, unique: true },
    photo: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["in-progress", "active", "blocked"],
    },
    lastLogin: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  // Set status based on role
  if (user.role === "user" && !user.status) {
    user.status = "active";
  } else if (user.role !== "user" && !user.status) {
    user.status = "pending";
  }
  next();
}); // After creating or updating a user, remove the password field from the returned document
userSchema.post("save", function (doc, next) {
  (doc.password = ""), next();
});

// Middleware to ensure password is not returned during aggregation
userSchema.pre("aggregate", function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({ $unset: "password" }); // Remove the password field from the aggregation results
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const user = await User.findOne({ email: this.getQuery().email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  next();
});

// Static methods for user-related operations
userSchema.statics.isUserExists = async function (email: string) {
  const user = await User.findOne({ email });
  return user;
};
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  const user = await User.findOne({ email }).select("+password");
  return user;
};
userSchema.statics.isUserStatusActive = async function (email: string) {
  return await User.findOne({ email, status: "active" });
};
userSchema.statics.isUserDeleted = async function (email: string) {
  return await User.findOne({ email, isDeleted: true });
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPass: string,
  hashedPass: string
) {
  return await bcrypt.compare(plainTextPass, hashedPass);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimeStamp;
};

export const User = model<TUser, UserModel>("User", userSchema);

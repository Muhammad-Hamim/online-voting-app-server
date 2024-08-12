import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//hash password before save to db
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
});
// after creating user, return empty password
userSchema.post("save", function (doc, next) {
  (doc.password = ""), next();
});

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

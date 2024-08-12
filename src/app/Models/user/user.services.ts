import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { sendImgToCloudinary } from "../../utils/sendImgToCloudinary";
import { sendAdminLoginEmail } from "../../utils/sendAdminLoginEmail";
import { generateRandomPassword } from "./user.utils";

const createUserIntoDB = async (payload: TUser, photo: any) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "user already exists");
  }
  //if password is not given, use default password
  if (!payload.password) {
    payload.password = config.default_pass as string;
  }
  //set user role to user since we're creating user
  if (!payload.role) {
    payload.role = "user";
  }
  // send image to cloudinary
  const imgName = `${payload.name}-${payload.email}`;
  const path = photo?.path;
  const { secure_url } = await sendImgToCloudinary(imgName, path);
  payload.photo = secure_url;
  const result = await User.create(payload);
  return result;
};
const createAdminIntoDB = async (payload: TUser, photo: any) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "user already exists");
  }
  //set random password
  payload.password = generateRandomPassword(8);
  //set user role to user since we're creating user
  if (!payload.role) {
    payload.role = "admin";
  }
  // send image to cloudinary
  const imgName = `${payload.name}-${payload.email}`;
  const path = photo?.path;
  const { secure_url } = await sendImgToCloudinary(imgName, path);
  console.log(payload.password);
  payload.photo = secure_url;
  //create admin
  const result = await User.create(payload);
  //send email with password
  if (result) {
    sendAdminLoginEmail(result.email, payload.password);
  }
  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  if (result.length) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "no user found");
  }
};
const getSingleUserFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
  const result = await User.findOne({ email });
  return result;
};
const updateUserBasicInfoIntoDB = async (
  email: string,
  payload: Partial<TUser>
) => {
  const user = await User.isUserExists(email);
  if (!user || user?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist or deleted");
  }

  const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
  });
  return result;
};
const updateUserRoleAndStatusIntoDB = async (
  email: string,
  payload: Partial<TUser>
) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
  });
  return result;
};
const deleteUserIntoDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user || user?.isDeleted === true) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user does not exist or already deleted"
    );
  }
  const result = await User.findOneAndUpdate(
    { email },
    { isDeleted: true },
    { new: true }
  );
  return result;
};

const getMeFromDB = async (payload: JwtPayload) => {
  const result = await User.findOne({ email: payload.email });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  createAdminIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserBasicInfoIntoDB,
  updateUserRoleAndStatusIntoDB,
  deleteUserIntoDB,
  getMeFromDB,
};

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { sendImgToCloudinary } from "../../utils/sendImgToCloudinary";
import { sendUserEmail } from "../../utils/sendUserEmail";
import { generateRandomPassword } from "./user.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { userSearchableFields } from "./user.constant";

const createUserIntoDB = async (payload: TUser, photo: any) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "user already exists");
  }
  //set random password
  payload.password = generateRandomPassword(8);
  //set user role to user since we're creating user
  if (!payload.role) {
    payload.role = "user";
  }
  // send image to cloudinary
  const imgName = `${payload.name}-${payload.email}`;
  const path = photo?.path;
  const { secure_url } = await sendImgToCloudinary(imgName, path);
  payload.photo = secure_url;
  payload.lastLogin = new Date();
  const result = await User.create(payload);
  //send email with password
  if (result) {
    sendUserEmail(result.email, payload.password);
  }
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
  payload.photo = secure_url;
  payload.lastLogin = new Date();
  //create admin
  const result = await User.create(payload);
  //send email with password
  if (result) {
    sendUserEmail(result.email, payload.password);
  }
  return result;
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query, "find").search(
    userSearchableFields
  );
  const result = await userQuery.execute();
  return result;
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
  userInfo: JwtPayload,
  payload: Partial<TUser>, // Payload can be partial
  photo: any
) => {
  const email = userInfo?.email;
  const user = await User.isUserExists(email);
  if (!user || user?.isDeleted === true) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User does not exist or is deleted"
    );
  }

  if (photo) {
    // Handle photo upload to cloudinary if provided
    const imgName = `${user.name}-${user.email}`;
    const path = photo?.path;
    const { secure_url } = await sendImgToCloudinary(imgName, path);
    payload.photo = secure_url; // Update photo URL in payload
  }

  // Update user with provided fields
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

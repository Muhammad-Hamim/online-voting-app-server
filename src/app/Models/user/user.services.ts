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

const createUserIntoDB = async (payload: TUser, photo: Express.Multer.File) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "User already exists");
  }
  // Set random password and default role
  payload.role = payload.role || "user";

  // Upload image to Cloudinary using buffer from multer memory storage
  const imgName = `${payload.name}-${payload.email}`;
  const secure_url = await sendImgToCloudinary(imgName, photo.buffer);

  // Store secure URL in payload and set other fields
  payload.photo = secure_url;
  payload.lastLogin = new Date();

  // Create the user in the database
  const result = await User.create(payload);
  return result;
};

const createAdminIntoDB = async (
  payload: TUser,
  photo: Express.Multer.File
) => {
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
  // Upload image to Cloudinary using buffer from multer memory storage
  const imgName = `${payload.name}-${payload.email}`;
  const secure_url = await sendImgToCloudinary(imgName, photo.buffer);

  // Store secure URL in payload and set other fields
  payload.photo = secure_url;
  payload.lastLogin = new Date();

  // Create the user in the database
  const result = await User.create(payload);

  // Send email with password if user creation is successful
  if (result) {
    sendUserEmail(result.email, payload.password);
  }

  return result;
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query, "find")
    .search(userSearchableFields)
    .paginate();
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
  photo: Express.Multer.File
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
    // Upload image to Cloudinary using buffer from multer memory storage
    const imgName = `${payload.name}-${payload.email}`;
    const secure_url = await sendImgToCloudinary(imgName, photo.buffer);
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

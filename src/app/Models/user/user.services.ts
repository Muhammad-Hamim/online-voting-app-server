import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.FORBIDDEN, "user already exists");
  }
  const result = await User.create(payload);
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
  const userDeleted = await User.isUserDeleted(email);
  if (!user || userDeleted) {
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
  const userDeleted = await User.isUserDeleted(email);
  if (!user || userDeleted) {
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

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserBasicInfoIntoDB,
  updateUserRoleAndStatusIntoDB,
  deleteUserIntoDB,
};

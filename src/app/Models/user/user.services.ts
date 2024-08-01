import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
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
  const user = new User();
  if (await user.isUserExists(email)) {
    const result = await User.findOne({ email });
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};
const updateUserIntoDB = async (email: string, payload: Partial<TUser>) => {
  const user = new User();
  if (await user.isUserExists(email)) {
    const result = await User.findOneAndUpdate({ email }, payload, {
      new: true,
    });
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};
const deleteUserIntoDB = async (email: string) => {
  const user = new User();
  if (await user.isUserExists(email)) {
    const result = await User.findOneAndUpdate(
      { email },
      { isDeleted: true },
      { new: true }
    );
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};

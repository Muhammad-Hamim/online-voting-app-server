
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TJwtPayload, TLoginUser, TPasswordData } from "./auth.interface";
import config from "../../config";
import { generateToken, verifyToken } from "./auth.utils";
import bcrypt from "bcrypt";
import { sendResetEmail } from "../../utils/sendResetEmail";
import { USER_ROLE } from "../user/user.constant";
import  httpStatus  from 'http-status';
import { JwtPayload } from "jsonwebtoken";

const loginUserIntoDB = async (payload: TLoginUser) => {
  //checking If the user is exists
  const user = await User.isUserExistsByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //checking if the user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User has been deleted");
  }
  //checking if the user status is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
  }
  //checking user role
  if (user.role !== USER_ROLE.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not a valid user");
  }
  //checking if the password is incorrect
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  //access granted: send accessToken, Refresh token
  //create token and sent to the client
  const jwtPayload: TJwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES_IN as string
  );
  return { accessToken, refreshToken };
};
const loginAdminIntoDB = async (payload: TLoginUser) => {
  //checking If the user is exists
  const user = await User.isUserExistsByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //checking if the user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User has been deleted");
  }
  //checking if the user status is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
  }
  //checking user role
  if (user.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not an Admin");
  }
  //checking if the password is incorrect
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  //access granted: send accessToken, Refresh token
  //create token and sent to the client
  const jwtPayload: TJwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES_IN as string
  );
  return { accessToken, refreshToken };
};

const logoutUser = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user");
  }
  return true;
};

const changeUserPassIntoDB = async (
  userData: JwtPayload,
  payload: TPasswordData
) => {
  //checking If the user is exists
  const user = await User.isUserExistsByEmail(userData?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //checking if the user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User has been deleted");
  }
  //checking if the user status is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
  }
  //checking if the password is incorrect
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.oldPassword,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "unauthorized user");
  }
  // check if the token is valid
  const decoded = verifyToken(token, config.JWT_REFRESH_SECRET as string);
  const { email, iat } = decoded;

  //check if user is exists
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  // check if user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, "your account has been deleted!");
  }
  // check if user is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "your account has been blocked!");
  }
  // compare password changed time and jwt issued time
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "you are not authorized!! log in again"
    );
  }

  //create token and sent to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );
  return {
    accessToken,
  };
};
const forgetPassword = async (email: string) => {
  //checking If the user is exists
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //checking if the user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User has been deleted");
  }
  //checking if the user status is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
  }

  // generate access token
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const resetToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    "10m"
  );

  const resetUiLink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;
  sendResetEmail(user.email, resetUiLink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  //checking If the user is exists
  const user = await User.isUserExistsByEmail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //checking if the user is deleted
  if (user?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "User has been deleted");
  }
  //checking if the user status is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
  }
  //check if the token is valid
  const decoded = verifyToken(token, config.JWT_ACCESS_SECRET as string);
  const { email, role } = decoded;
  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    { email, role },
    { password: newHashedPassword, passwordChangedAt: new Date() }
  );
  return null;
};

export const AuthServices = {
  loginUserIntoDB,
  loginAdminIntoDB,
  logoutUser,
  changeUserPassIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};

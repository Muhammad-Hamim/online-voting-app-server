import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import config from "../config";
import { User } from "../Models/user/user.model";
import { TUserRole } from "../Models/user/user.interface";
import { verifyToken } from "../Models/auth/auth.utils";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    // check if the token is missing (user is not logged in)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "unauthorized user");
    }
    
    // check if the token is valid
    const decoded = verifyToken(token, config.JWT_ACCESS_SECRET as string);
    const { role, email, iat } = decoded;
    // check if user exists
    const user = await User.isUserExists(email);
    if (!user) {
      console.log('hello not allowed')
      throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
    }

    // check if user is deleted
    if (user?.isDeleted === true) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "your account has been deleted!"
      );
    }

    // check if user is blocked
    if (user?.status === "blocked") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "your account has been blocked!"
      );
    }

    // check if admin is pending
    if (user?.role === "admin" && user?.status === "pending") {
      throw new AppError(httpStatus.FORBIDDEN, "your account is under review");
    }

    // compare password changed time and JWT issued time
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "you are not authorized!! log in again"
      );
    }

    // check user role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "unauthorized user");
    }
    // if everything is fine, add user to req object
    req.user = decoded;
    next();
  });
};

export default auth;

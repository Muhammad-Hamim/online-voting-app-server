import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { accessToken, refreshToken } = result;
  res.cookie(
    "token",
    { accessToken, refreshToken },
    {
      secure: config.NODE_ENV === "Development" ? false : true,
      httpOnly: true,
    }
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});
const loginAdmin = catchAsync(async (req, res) => {
  const result = await AuthServices.loginAdminIntoDB(req.body);
  const { accessToken, refreshToken } = result;
  res.cookie(
    "token",
    { accessToken, refreshToken },
    {
      secure: config.NODE_ENV === "Development" ? false : true,
      httpOnly: true,
    }
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully",
    data: result,
  });
});
const changeUserPass = catchAsync(async (req, res) => {
  const result = await AuthServices.changeUserPassIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User password has been changed successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reset link is generated successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password reset successful",
    data: result,
  });
});
export const AuthControllers = {
  loginUser,
  loginAdmin,
  changeUserPass,
  refreshToken,
  forgetPassword,
  resetPassword,
};

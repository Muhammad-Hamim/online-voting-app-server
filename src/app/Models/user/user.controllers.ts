import { UserServices } from "./user.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user created successfully",
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDB(req.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "admin created successfully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "users fetched successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getSingleUserFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user fetched successfully",
    data: result,
  });
});

const updateUserBasicInfo = catchAsync(async (req, res) => {
  const photo = req?.file || null;
  const userData = req?.body || {};
  const result = await UserServices.updateUserBasicInfoIntoDB(
    req.user,
    userData,
    photo
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user updated successfully",
    data: result,
  });
});
const updateUserRoleAndStatus = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.updateUserRoleAndStatusIntoDB(
    email,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.deleteUserIntoDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user deleted successfully",
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMeFromDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "your data retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  createAdmin,
  getAllUser,
  getSingleUser,
  updateUserBasicInfo,
  updateUserRoleAndStatus,
  deleteUser,
  getMe,
};

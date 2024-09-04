import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import {
  createAdminValidationSchema,
  createUserValidationSchema,
  updateUserRoleAndStatusValidationSchema,
  updateUserValidationSchema,
} from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../utils/sendImgToCloudinary";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const router = express.Router();

router.post(
  "/create-user",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Invalid form data"));
    }
    next();
  },
  validateRequest(createUserValidationSchema),
  UserControllers.createUser
);

router.post(
  "/create-admin",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Invalid form data"));
    }
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin
);
router.get(
  "/all-users",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getAllUser
);
router.get(
  "/me",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe
);
router.get(
  "/single-user/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getSingleUser
);

router.patch(
  "/update-profile",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Invalid form data"));
    }
    next();
  },
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  validateRequest(updateUserValidationSchema),
  UserControllers.updateUserBasicInfo
);
router.patch(
  "/update-user-status-role/:email",
  auth(USER_ROLE.superAdmin),
  validateRequest(updateUserRoleAndStatusValidationSchema),
  UserControllers.updateUserRoleAndStatus
);
router.delete(
  "/delete-user/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  UserControllers.deleteUser
);

export const UserRoute = router;

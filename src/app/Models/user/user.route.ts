import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import {
  createUserValidationSchema,
  updateUserRoleAndStatusValidationSchema,
  updateUserValidationSchema,
} from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../utils/sendImgToCloudinary";

const router = express.Router();

router.post(
  "/create-user",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createUserValidationSchema),
  UserControllers.createUser
);
router.post(
  "/create-admin",
  auth(USER_ROLE.superAdmin),
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createUserValidationSchema),
  UserControllers.createAdmin
);
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getAllUser
);
router.get(
  "/me",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe
);
router.get(
  "/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getSingleUser
);

router.patch(
  "/update-profile",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
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
  "/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  UserControllers.deleteUser
);

export const UserRoute = router;

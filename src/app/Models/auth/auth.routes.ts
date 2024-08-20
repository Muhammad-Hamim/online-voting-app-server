import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  changePassValidationSchema,
  forgetPasswordValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  resetPasswordValidationSchema,
} from "./auth.validation";
import { AuthControllers } from "./auth.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthControllers.loginUser
);
router.post(
  "/admin-login",
  validateRequest(loginValidationSchema),
  AuthControllers.loginAdmin
);
router.post(
  "/logout",
  AuthControllers.logoutUser
);
router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin),
  validateRequest(changePassValidationSchema),
  AuthControllers.changeUserPass
);
router.post(
  "/refresh-token",
  // validateRequest(refreshTokenValidationSchema),
  AuthControllers.refreshToken
);
router.post(
  "/forget-password",
  validateRequest(forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  AuthControllers.resetPassword
);
export const AuthRoutes = router;

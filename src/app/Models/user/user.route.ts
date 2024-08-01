import express from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(createUserValidationSchema),
  UserControllers.createUser
);
router.get("/", UserControllers.getAllUser);
router.get("/:email", UserControllers.getSingleUser);
router.patch(
  "/:email",
  validateRequest(updateUserValidationSchema),
  UserControllers.updateUser
);
router.delete("/:email", UserControllers.deleteUser);

export const UserRoute = router;

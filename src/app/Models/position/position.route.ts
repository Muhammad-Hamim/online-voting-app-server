import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createPositionValidationSchema,
  updatePositionStatusAndTerminationMessageValidationSchema,
  updatePositionValidationSchema,
} from "./position.validation";
import { PositionControllers } from "./position.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-position",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(createPositionValidationSchema),
  PositionControllers.createPosition
);
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PositionControllers.getAllPosition
);
// router.get(
//   "/:id",
//   auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),

//   PositionControllers.getSinglePosition
// );
router.get(
  "/get-positions-with-candidates",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PositionControllers.getAllPositionsWithCandidatesAndWinner
);
router.get(
  "/get-positions-with-candidates-and-voters",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PositionControllers.getAllPositionsWithCandidatesAndVoters
);
router.get(
  "/get-candidate-for-position/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  PositionControllers.getCandidateForPosition
);
router.patch(
  "/:id",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updatePositionValidationSchema),
  PositionControllers.updatePosition
);
router.patch(
  "/update-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updatePositionStatusAndTerminationMessageValidationSchema),
  PositionControllers.updatePositionStatusAndTerminationMessage
);

export const PositionRoute = router;

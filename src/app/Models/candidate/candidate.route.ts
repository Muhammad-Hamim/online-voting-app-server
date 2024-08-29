import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  candidateValidationSchema,
  updateCandidateInfoValidationSchema,
  updateCandidateStatusValidationSchema,
} from "./candidate.validation";
import { CandidateControllers } from "./candidate.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-candidate",
  auth(USER_ROLE.user),
  validateRequest(candidateValidationSchema),
  CandidateControllers.createCandidate
);
router.get(
  "/my-applications/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  CandidateControllers.getMyApplications
);
// router.get(
//   "/",
//   auth(USER_ROLE.superAdmin),
//   CandidateControllers.getAllCandidate
// );

router.get(
  "/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.user),
  CandidateControllers.getSingleCandidate
);

router.patch(
  "/update-message/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(updateCandidateInfoValidationSchema),
  CandidateControllers.updateCandidate
);
router.patch(
  "/update-candidate-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateCandidateStatusValidationSchema),
  CandidateControllers.updateCandidateStatus
);

export const CandidateRoute = router;

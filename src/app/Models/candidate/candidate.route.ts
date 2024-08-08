import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  candidateValidationSchema,
  updateCandidateInfoValidationSchema,
  updateCandidateStatusValidationSchema,
} from "./candidate.validation";
import { CandidateControllers } from "./candidate.controllers";

const router = express.Router();

router.post(
  "/create-candidate",
  validateRequest(candidateValidationSchema),
  CandidateControllers.createCandidate
);
router.get("/", CandidateControllers.getAllCandidate);
router.get("/:email", CandidateControllers.getSingleCandidate);

router.patch(
  "/:email",
  validateRequest(updateCandidateInfoValidationSchema),
  CandidateControllers.updateCandidate
);
router.patch(
  "/update-candidate-status/:email",
  validateRequest(updateCandidateStatusValidationSchema),
  CandidateControllers.updateCandidateStatus
);

export const CandidateRoute = router;

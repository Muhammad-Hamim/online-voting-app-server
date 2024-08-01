import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { candidateValidationSchema } from "./candidate.validation";
import { CandidateControllers } from "./candidate.controllers";

const router = express.Router();

router.post(
  "/create-candidate",
  validateRequest(candidateValidationSchema),
  CandidateControllers.createCandidate
);
router.get("/", CandidateControllers.getAllCandidate);
router.get("/:email", CandidateControllers.getSingleCandidate);

export const CandidateRoute = router;

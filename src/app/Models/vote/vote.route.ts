import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { voteValidationSchema } from "./vote.validation";
import { VoteControllers } from "./vote.controllers";

const router = express.Router();

router.post(
  "/create-vote",
  validateRequest(voteValidationSchema),
  VoteControllers.createVote
);
router.get("/", VoteControllers.getAllVote);
router.get("/:email", VoteControllers.getSingleVote);
router.get("/:candidate/:position", VoteControllers.getCandidateBasedVoterList);

export const VoteRoute = router;

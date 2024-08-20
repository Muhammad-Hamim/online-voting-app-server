import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { voteValidationSchema } from "./vote.validation";
import { VoteControllers } from "./vote.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-vote",
  auth(USER_ROLE.user),
  validateRequest(voteValidationSchema),
  VoteControllers.createVote
);
router.get("/", auth(USER_ROLE.superAdmin), VoteControllers.getAllVote);
router.get("/get-my-votes", auth(USER_ROLE.user), VoteControllers.getMyVotes);
router.get("/:email", VoteControllers.getSingleUserVote);
router.get(
  "/:candidate/:position",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  VoteControllers.getCandidateBasedVoterList
);

export const VoteRoute = router;

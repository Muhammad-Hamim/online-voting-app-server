import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TVote } from "./vote.interface";
import { Vote } from "./vote.model";
import { Position } from "../position/position.model";
import mongoose from "mongoose";
import { Candidate } from "../candidate/candidate.model";

const createVoteIntoDB = async (payload: TVote) => {
  const user = new User();
  if (await user.isUserExists(payload.email)) {
    const isPositionStatusOngoing = await Position.findOne({
      _id: payload.position,
      status: "ongoing",
    });
    const isUserAlreadyVoted = await Vote.findOne({
      voter: payload.voter,
      position: payload.position,
    });
    const isCandidateStatusApproved = await Candidate.findOne({
      _id: payload.candidate,
      status: "approved",
    });
console.log(isCandidateStatusApproved)
    if (
      !isPositionStatusOngoing ||
      isUserAlreadyVoted ||
      !isCandidateStatusApproved
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot vote for this position or candidate"
      );
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const vote = await Vote.create([payload], { session });
      if (!vote) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create vote");
      }

      const candidate = await Candidate.findOneAndUpdate(
        { _id: payload.candidate },
        { $inc: { votes: 1 } },
        { new: true, session }
      );
      if (!candidate) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to update candidate votes"
        );
      }

      await session.commitTransaction();
      await session.endSession();

      return vote;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to vote");
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
};

const getAllVotesFromDB = async () => {
  const result = await Vote.find()
    .populate("voter", "name email studentId")
    .populate("candidate", "name email studentId")
    .populate("position");
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "no votes found");
  }
  return result;
};

const getSingleVoteFromDB = async (email: string) => {
  const user = new User();
  if (await user.isUserExists(email)) {
    const result = await Vote.findOne({ email })
      .populate("voter", "name email")
      .populate("candidate", "name email")
      .populate("position");

    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};

export const VoteServices = {
  createVoteIntoDB,
  getAllVotesFromDB,
  getSingleVoteFromDB,
};

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TVote } from "./vote.interface";
import { Vote } from "./vote.model";
import { Position } from "../position/position.model";
import mongoose from "mongoose";
import { Candidate } from "../candidate/candidate.model";

const createVoteIntoDB = async (payload: TVote) => {
  const user = await User.isUserExists(payload?.email);
  if (!user || user?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist or deleted");
  }
  //check if position is exists and status is ongoing
  const position = await Position.isPositionExists(payload.position.toString());
  if (!position || position?.status !== "ongoing") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "position does not exist or status is not ongoing"
    );
  }
  const isUserAlreadyVoted = await Vote.isUserAlreadyVoted(
    payload.voter.toString(),
    payload.position.toString()
  );
  const isCandidateStatusApproved = await Candidate.findOne({
    _id: payload.candidate,
    status: "approved",
  });
  if (isUserAlreadyVoted || !isCandidateStatusApproved) {
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
};

const getAllVotesFromDB = async () => {
  const result = await Vote.find()
    .populate("voter", "name email studentId")
    .populate({
      path: "candidate",
      select: "candidate email votes", // fields to include from the Candidate model
      populate: {
        path: "candidate", // Assuming 'candidate' references a user model
        select: "name email studentId", // fields to include from the User model
      },
    })
    .populate("position");
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "no votes found");
  }
  return result;
};

const getCandidateBasedVoterListFromDB = async (
  candidate: string,
  position: string
) => {
  //check if the candidate is exists
  const candidateData = await Candidate.findOne({ _id: candidate });
  if (!candidateData) {
    throw new AppError(httpStatus.NOT_FOUND, "candidate does not exists");
  }
  //check if the position is exist
  const positionDate = await Position.isPositionExists(position);
  if (!positionDate) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  const result = await Vote.find({ candidate, position }).populate(
    "voter",
    "name studentId email"
  ).select("voter");
  return result;
};

const getSingleVoteFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
  const result = await Vote.findOne({ email })
    .populate("voter", "name email studentId")
    .populate("candidate", "name email votes")
    .populate("position", "title description");

  return result;
};

export const VoteServices = {
  createVoteIntoDB,
  getAllVotesFromDB,
  getSingleVoteFromDB,
  getCandidateBasedVoterListFromDB,
};

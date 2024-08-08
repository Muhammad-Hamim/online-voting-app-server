import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TVote } from "./vote.interface";
import { Vote } from "./vote.model";
import { Position } from "../position/position.model";
import mongoose from "mongoose";
import { Candidate } from "../candidate/candidate.model";

const createVoteIntoDB = async (payload: TVote) => {
  //check if user is exists
  const user = await User.isUserExists(payload?.email);
  if (!user || user?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist or deleted");
  }
  //check if position is exists and status is ongoing
  const position = await Position.isPositionExists(payload.position.toString());
  if (
    !position ||
    position?.status !== "ongoing" ||
    position?.isDeleted === true
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "position does not exist or deleted or status is not ongoing"
    );
  }
  //check if the candidate is applied for this position or not
  const isCandidateAppliedForThisPosition = await Candidate.findOne({
    _id: payload?.candidate.toString(),
    position: payload?.position.toString(),
  });
  if (!isCandidateAppliedForThisPosition) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "candidate is not applied for this position"
    );
  }

  //check if user already voted to this position
  const isUserAlreadyVoted = await Vote.isUserAlreadyVoted(
    payload.voter.toString(),
    payload.position.toString()
  );
  if (isUserAlreadyVoted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User has already voted for this position"
    );
  }

  // check if the user status is not approved
  const isCandidateStatusApproved = await Candidate.findOne({
    _id: payload.candidate.toString(),
    status: "approved",
  });
  if (!isCandidateStatusApproved) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Candidate is not eligible to be voted for"
    );
  }
  //start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //create a vote
    const vote = await Vote.create([payload], { session });
    if (!vote) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create vote");
    }
    //update the candidate's votes
    const candidate = await Candidate.findByIdAndUpdate(
      payload.candidate.toString(),
      { $inc: { votes: 1 } },
      { new: true, session }
    );
    if (!candidate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update candidate votes"
      );
    }
    //commit the transaction
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
    .populate({
      path: "voter",
      select: "name email studentId",
    })
    .populate({
      path: "candidate",
      select: "candidate votes message photo",
      populate: {
        path: "candidate", // This refers to the `candidate` field in `Candidate` collection
        select: "name email studentId", // Assuming the User schema has these fields
      },
    })
    .populate("position");
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "no votes found");
  }
  return result;
};

const getCandidateBasedVoterListFromDB = async (
  candidateIdOrEmail: string,
  position: string
) => {
  //check if the candidate is exists
  const candidateData = await Candidate.findOne({
    $or: [{ _id: candidateIdOrEmail }, { email: candidateIdOrEmail }],
  });
  if (!candidateData) {
    throw new AppError(httpStatus.NOT_FOUND, "candidate does not exists");
  }
  //check if the position is exist
  const positionDate = await Position.isPositionExists(position);
  if (!positionDate) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }

  // Convert to ObjectId if necessary

  const candidateId = new mongoose.Types.ObjectId(candidateData._id);
  const positionId = new mongoose.Types.ObjectId(position);

  // Aggregate votes
  const result = await Vote.aggregate([
    {
      $match: {
        candidate: candidateId,
        position: positionId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "voter",
        foreignField: "_id",
        as: "voterDetails",
      },
    },
    {
      $unwind: {
        path: "$voterDetails",
      },
    },
    {
      $lookup: {
        from: "candidates",
        localField: "candidate",
        foreignField: "_id",
        as: "candidateDetails",
      },
    },
    {
      $unwind: {
        path: "$candidateDetails",
      },
    },
    {
      $lookup: {
        from: "positions",
        localField: "position",
        foreignField: "_id",
        as: "positionDetails",
      },
    },
    {
      $unwind: {
        path: "$positionDetails",
      },
    },
    {
      $group: {
        _id: null,
        candidate: {
          $first: {
            _id: "$candidateDetails._id",
            email: "$candidateDetails.email",
            photo: "$candidateDetails.photo",
            status: "$candidateDetails.status",
            votes: "$candidateDetails.votes",
          },
        },
        position: {
          $first: {
            _id: "$positionDetails._id",
            name: "$positionDetails.title",
            description: "$positionDetails.description",
            status: "$positionDetails.status",
          },
        },
        voters: {
          $push: {
            _id: "$voterDetails._id",
            name: "$voterDetails.name",
            email: "$voterDetails.email",
            studentId: "$voterDetails.studentId",
          },
        },
        votes: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "no voter found");
  }
  return result;
};

const getSingleUserVoteFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
  const result = await Vote.find({ email })
    .populate("voter", "name email studentId")
    .populate("candidate", "name email votes")
    .populate("position", "title description");

  return result;
};

export const VoteServices = {
  createVoteIntoDB,
  getAllVotesFromDB,
  getSingleUserVoteFromDB,
  getCandidateBasedVoterListFromDB,
};

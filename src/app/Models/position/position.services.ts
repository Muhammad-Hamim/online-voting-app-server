import httpStatus from "http-status";
import { TPosition } from "./position.interface";
import { Position } from "./position.model";
import AppError from "../../errors/AppError";
import { Candidate } from "../candidate/candidate.model";

const createPositionIntoDB = async (payload: TPosition) => {
  const result = await Position.create(payload);
  return result;
};
const getAllPositionsFromDB = async () => {
  const result = await Position.aggregate([
    // Stage 1: Lookup candidates
    {
      $lookup: {
        from: "candidates",
        localField: "_id",
        foreignField: "position",
        as: "appliedCandidates",
      },
    },
    // Stage 2: Add fields for appliedCandidates count and approvedCandidates array
    {
      $addFields: {
        appliedCandidates: { $size: "$appliedCandidates" },
      },
    },
  ]);

  if (result.length) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "No positions found");
  }
};

const getSinglePositionFromDB = async (id: string) => {
  const position = await Position.isPositionExists(id);
  if (!position) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  const result = await Position.findById(id);
  return result;
};
const updatePositionIntoDB = async (
  id: string,
  payload: Partial<TPosition>
) => {
  //check if position is exists
  const position = await Position.isPositionExists(id);
  if (!position) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  //check if the position status is "pending"
  if (position?.status !== "pending") {
    throw new AppError(httpStatus.FORBIDDEN, "Position status is not pending");
  }
  //check if the position is deleted
  if (position?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "Position is deleted");
  }
  const result = await Position.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const updatePositionStatusAndTerminationMessageIntoDB = async (
  id: string,
  payload: Partial<TPosition>
) => {
  // check if the position is exist
  const position = await Position.isPositionExists(id);
  if (!position) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  const result = await Position.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const getCandidateForPositionFromDB = async (position: string) => {
  //check if the position is exist
  const positionDate = await Position.isPositionExists(position);
  if (!positionDate) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  const result = await Candidate.find({ position })
    .populate("candidate", "name studentId email _id photo")
    .populate("position", "title description status");
  if (result.length) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "no candidate found");
  }
};
const getAllPositionsWithCandidatesAndWinnerFromDB = async () => {
  const result = await Position.aggregate([
    // Step 1: Lookup candidates for each position
    {
      $lookup: {
        from: "candidates",
        localField: "_id",
        foreignField: "position",
        as: "candidates",
      },
    },
    // Step 2: Unwind the candidates array
    {
      $unwind: {
        path: "$candidates",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Step 3: Lookup user details for each candidate
    {
      $lookup: {
        from: "users",
        localField: "candidates.candidate",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    // Step 4: Combine candidate info with user details
    {
      $addFields: {
        "candidates.name": { $arrayElemAt: ["$userDetails.name", 0] },
        "candidates.email": { $arrayElemAt: ["$userDetails.email", 0] },
        "candidates.photo": { $arrayElemAt: ["$userDetails.photo", 0] },
        "candidates.studentId": { $arrayElemAt: ["$userDetails.studentId", 0] },
      },
    },
    // Step 5: Group back the candidates array
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        duration: { $first: "$duration" },
        creator: { $first: "$creator" },
        applicationDeadline: { $first: "$applicationDeadline" },
        status: { $first: "$status" },
        terminationMessage: { $first: "$terminationMessage" },
        maxVotes: { $first: "$maxVotes" },
        maxCandidate: { $first: "$maxCandidate" },
        isDeleted: { $first: "$isDeleted" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        candidates: { $push: "$candidates" },
      },
    },
    // Step 6: Determine the winner
    {
      $addFields: {
        winner: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$candidates",
                as: "candidate",
                cond: {
                  $eq: ["$$candidate.votes", { $max: "$candidates.votes" }],
                },
              },
            },
            0,
          ],
        },
      },
    },
    // Step 7: Project the final result
    {
      $project: {
        title: 1,
        description: 1,
        creator: 1,
        status: 1,
        "candidates._id": 1,
        "candidates.email": 1,
        "candidates.studentId": 1,
        "candidates.votes": 1,
        "candidates.status": 1,
        "candidates.message": 1,
        "candidates.name": 1,
        "candidates.photo": 1,
        "winner._id": 1,
        "winner.email": 1,
        "winner.studentId": 1,
        "winner.status": 1,
        "winner.votes": 1,
        "winner.message": 1,
        "winner.name": 1,
        "winner.photo": 1,
      },
    },
  ]);
  return result;
};
export const PositionServices = {
  createPositionIntoDB,
  getAllPositionsFromDB,
  getSinglePositionFromDB,
  updatePositionIntoDB,
  getCandidateForPositionFromDB,
  updatePositionStatusAndTerminationMessageIntoDB,
  getAllPositionsWithCandidatesAndWinnerFromDB,
};

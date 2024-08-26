import httpStatus from "http-status";
import { TPosition } from "./position.interface";
import { Position } from "./position.model";
import AppError from "../../errors/AppError";
import { Candidate } from "../candidate/candidate.model";
import { parseDuration } from "./position.utils";
import {
  getAllPositionsWithCandidatesAndWinnerQuery,
  getPositionsWithCandidatesAndVotersQuery,
} from "../../utils/query";
import QueryBuilder from "../../builder/QueryBuilder";
import { positionSearchableField } from "./position.constant";

const createPositionIntoDB = async (payload: TPosition) => {
  if (new Date(payload.startTime) > new Date(payload.endTime)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "start time must be before end time"
    );
  }
  if (new Date(payload.startTime) < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "start time must be after current time"
    );
  }
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
  if (position?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Position is deleted");
  }
  // Calculate and update the end time if start time and duration are provided
  if (payload.startTime || payload.endTime) {
    const startTime = new Date(payload.startTime || position.startTime);
    const endTime = new Date(payload.endTime || position.endTime);
    if (endTime < startTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "end time can not be before start time"
      );
    }
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
  //get all approved candidate
  const candidate = await Candidate.find({
    position: id,
    status: "approved",
  }).select("status");

  // check if the position is exist
  const position = await Position.isPositionExists(id);
  if (!position) {
    throw new AppError(httpStatus.NOT_FOUND, "Position does not exists");
  }
  if (position.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Position has been deleted!");
  }
  if (payload.status === "terminated" && !payload.terminationMessage) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide termination message"
    );
  }
  if (payload.status === "terminated") {
    payload.endTime = new Date();
  }
  if (payload.status === "live" && position.status !== "live") {
    if (candidate.length < 2) {
      throw new AppError(httpStatus.FORBIDDEN, "No approved candidate found");
    }
    const startTime = new Date();

    payload.startTime = startTime;
  }
  if (
    (position.status === "closed" || position.status === "terminated") &&
    (payload.status === "live" || payload.status === "pending")
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "you can not update closed/terminated position to live/pending"
    );
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
const getAllPositionsWithCandidatesAndWinnerFromDB = async (
  query: Record<string, unknown>
) => {
  const positionQuery = new QueryBuilder(
    Position.aggregate(getAllPositionsWithCandidatesAndWinnerQuery),
    query,
    "aggregate"
  ).sort();
  const result = await positionQuery.execute();
  return result;
};

const getAllPositionsWithCandidatesAndVotersFromDB = async (
  query: Record<string, unknown>
) => {
  const positionQuery = new QueryBuilder(
    Position.aggregate(getPositionsWithCandidatesAndVotersQuery),
    query,
    "aggregate"
  )
    .search(positionSearchableField)
    .sort();

  const result = await positionQuery.execute();

  return result;
};
const updatePositionStatuses = async (): Promise<void> => {
  const now = new Date().toISOString(); // Convert the current time to the same string format

  // Update positions where the startTime has passed and status is still 'pending'
  await Position.updateMany(
    {
      startTime: { $lte: now }, // Compare the string representation
      status: "pending",
    },
    { status: "live" }
  );

  // Update positions where the endTime has passed and status is still 'live'
  await Position.updateMany(
    {
      endTime: { $lte: now }, // Compare the string representation
      status: "live",
    },
    { status: "closed" }
  );
};

export const PositionServices = {
  createPositionIntoDB,
  getAllPositionsFromDB,
  getSinglePositionFromDB,
  updatePositionIntoDB,
  getCandidateForPositionFromDB,
  updatePositionStatusAndTerminationMessageIntoDB,
  getAllPositionsWithCandidatesAndWinnerFromDB,
  getAllPositionsWithCandidatesAndVotersFromDB,
  updatePositionStatuses,
};

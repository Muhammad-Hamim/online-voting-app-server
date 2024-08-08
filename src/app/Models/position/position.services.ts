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
  const result = await Position.find();
  if (result.length) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "no user found");
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
  if (await Position.isPositionDeleted(id)) {
    throw new AppError(httpStatus.FORBIDDEN, "Position is deleted");
  }
  const result = await Position.findByIdAndUpdate(id, payload, {
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
  const result = await Candidate.find({ position: position })
    .populate("candidate", "name email status")
    .populate("position", "title description status");
  if (result.length) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "no candidate found");
  }
};

export const PositionServices = {
  createPositionIntoDB,
  getAllPositionsFromDB,
  getSinglePositionFromDB,
  updatePositionIntoDB,
  getCandidateForPositionFromDB,
};

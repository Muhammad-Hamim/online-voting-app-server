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
  const result = await Position.findById(id);
  return result;
};
const updatePositionIntoDB = async (
  id: string,
  payload: Partial<TPosition>
) => {
  const result = await Position.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const getCandidateForPositionFromDB = async (position: string) => {
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

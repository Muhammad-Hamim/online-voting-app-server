import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TCandidate } from "./candidate.interface";
import { Candidate } from "./candidate.model";

const createCandidateIntoDB = async (payload: TCandidate) => {
  const user = new User();
  if (await user.isUserExists(payload.email)) {
    const result = await Candidate.create(payload);
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};

const getAllCandidatesFromDB = async () => {
  const result = await Candidate.find()
    .populate("candidate", "name email")
    .populate("position");
  return result;
};

const getSingleCandidateFromDB = async (email: string) => {
  const user = new User();
  if (await user.isUserExists(email)) {
    const result = await Candidate.findOne({ email })
      .populate("candidate", "name email")
      .populate("position");

    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user does not exist");
  }
};



export const CandidateServices = {
  createCandidateIntoDB,
  getAllCandidatesFromDB,
  getSingleCandidateFromDB,
};

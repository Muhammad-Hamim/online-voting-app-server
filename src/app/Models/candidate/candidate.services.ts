import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TCandidate } from "./candidate.interface";
import { Candidate } from "./candidate.model";
import { Position } from "../position/position.model";

const createCandidateIntoDB = async (payload: TCandidate) => {
  //check if user is exists
  const user = await User.isUserExists(payload?.email);
  if (!user || user?.isDeleted === true || user?.status === "blocked") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user does not exist or deleted or blocked"
    );
  }
  //check if position is exists and status is pending
  const position = await Position.isPositionExists(payload.position.toString());
  if (
    !position ||
    position?.isDeleted === true ||
    position?.status !== "pending"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "position does not exists or deleted or status is not pending"
    );
  }
  // check if user is already applied for this position
  const isCandidateAlreadyApplied = await Candidate.isCandidateAlreadyApplied(
    payload.candidate.toString(),
    payload.position.toString()
  );
  if (isCandidateAlreadyApplied) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "you already applied for this position"
    );
  }
  //check if the maximum candidate is already filled
  const maxCandidateNumber = position?.maxCandidate;
  const appliedApprovedCandidate = await Candidate.isMaxCandidateAlreadyFilled(
    payload.position.toString()
  );
  if (appliedApprovedCandidate >= maxCandidateNumber) {
    throw new AppError(httpStatus.FORBIDDEN, "candidate is already filled");
  }

  const result = await Candidate.create(payload);
  return result;
};

const getAllCandidatesFromDB = async () => {
  const result = await Candidate.find()
    .populate("candidate", "name studentId")
    .populate("position");
  return result;
};

const getSingleCandidateFromDB = async (email: string) => {
  const candidate = await Candidate.isCandidateExists(email);
  if (!candidate) {
    throw new AppError(httpStatus.NOT_FOUND, "candidate does not exists");
  }

  const result = await Candidate.findOne({ email })
    .populate("candidate", "name studentId")
    .populate("position");

  return result;
};

const updateCandidateIntoDB = async (
  email: string,
  payload: Partial<TCandidate>
) => {
  const candidate = await Candidate.isCandidateExists(email);
  if (!candidate) {
    throw new AppError(httpStatus.NOT_FOUND, "candidate does not exists");
  }
  if (candidate?.status === "approved") {
    throw new AppError(httpStatus.FORBIDDEN, "candidate is already approved");
  }

  const result = await Candidate.findOneAndUpdate({ email }, payload, {
    new: true,
  });
  return result;
};

const updateCandidateStatusIntoDB = async (
  email: string,
  payload: Partial<TCandidate>
) => {
  const candidate = await Candidate.isCandidateExists(email);
  if (!candidate) {
    throw new AppError(httpStatus.NOT_FOUND, "candidate does not exists");
  }
  const result = await Candidate.findOneAndUpdate({ email }, payload, {
    new: true,
  });
  return result;
};

export const CandidateServices = {
  createCandidateIntoDB,
  getAllCandidatesFromDB,
  getSingleCandidateFromDB,
  updateCandidateIntoDB,
  updateCandidateStatusIntoDB,
};

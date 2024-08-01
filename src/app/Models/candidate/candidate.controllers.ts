import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CandidateServices } from "./candidate.services";

const createCandidate = catchAsync(async (req, res) => {
  const result = await CandidateServices.createCandidateIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate created successfully",
    data: result,
  });
});

const getAllCandidate = catchAsync(async (req, res) => {
  const result = await CandidateServices.getAllCandidatesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate retrieved successfully",
    data: result,
  });
});

const getSingleCandidate = catchAsync(async (req, res) => {
  const result = await CandidateServices.getSingleCandidateFromDB(req.params.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate retrieved successfully",
    data: result,
  });
});


export const CandidateControllers = {
  createCandidate,
  getAllCandidate,
  getSingleCandidate,
};

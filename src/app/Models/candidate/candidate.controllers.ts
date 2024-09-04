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
  const result = await CandidateServices.getSingleCandidateFromDB(
    req.params.email
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate retrieved successfully",
    data: result,
  });
});

const updateCandidate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CandidateServices.updateCandidateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate info updated successfully",
    data: result,
  });
});
const updateCandidateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CandidateServices.updateCandidateStatusIntoDB(
    id,
    req.body,
    req.user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate status updated successfully",
    data: result,
  });
});
const getMyApplications = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await CandidateServices.getMyApplicationFromDB(
    email,
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate data retrieved successfully",
    data: result,
  });
});
export const CandidateControllers = {
  createCandidate,
  getAllCandidate,
  getSingleCandidate,
  updateCandidate,
  updateCandidateStatus,
  getMyApplications,
};

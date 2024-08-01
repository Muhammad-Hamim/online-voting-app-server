import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VoteServices } from "./vote.services";

const createVote = catchAsync(async (req, res) => {
  const result = await VoteServices.createVoteIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote created successfully",
    data: result,
  });
});

const getAllVote = catchAsync(async (req, res) => {
  const result = await VoteServices.getAllVotesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote retrieved successfully",
    data: result,
  });
});

const getSingleVote = catchAsync(async (req, res) => {
  const result = await VoteServices.getSingleVoteFromDB(req.params.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote retrieved successfully",
    data: result,
  });
});


export const VoteControllers = {
  createVote,
  getAllVote,
  getSingleVote,
};

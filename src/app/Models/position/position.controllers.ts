import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PositionServices } from "./position.services";

const createPosition = catchAsync(async (req, res) => {
  const result = await PositionServices.createPositionIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "position created successfully",
    data: result,
  });
});

const getAllPosition = catchAsync(async (req, res) => {
  const result = await PositionServices.getAllPositionsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "position retrieved successfully",
    data: result,
  });
});

const getSinglePosition = catchAsync(async (req, res) => {
  const result = await PositionServices.getSinglePositionFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "position retrieved successfully",
    data: result,
  });
});

const updatePosition = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await PositionServices.updatePositionIntoDB(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "position updated successfully",
    data: result,
  });
});
const updatePositionStatusAndTerminationMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const positionData = req.body;
  const result = await PositionServices.updatePositionStatusAndTerminationMessageIntoDB(id, positionData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "position status updated successfully",
    data: result,
  });
});
const getCandidateForPosition = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PositionServices.getCandidateForPositionFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Candidate retrieved successfully for the position",
    data: result,
  });
});
export const PositionControllers = {
  createPosition,
  getAllPosition,
  getSinglePosition,
  updatePosition,
  getCandidateForPosition,updatePositionStatusAndTerminationMessage
};

import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createPositionValidationSchema,
  updatePositionStatusAndTerminationMessageValidationSchema,
  updatePositionValidationSchema,
} from "./position.validation";
import { PositionControllers } from "./position.controllers";

const router = express.Router();

router.post(
  "/create-position",
  validateRequest(createPositionValidationSchema),
  PositionControllers.createPosition
);
router.get("/", PositionControllers.getAllPosition);
router.get("/:id", PositionControllers.getSinglePosition);
router.get(
  "/get-candidate-for-position/:id",
  PositionControllers.getCandidateForPosition
);
router.patch(
  "/:id",
  validateRequest(updatePositionValidationSchema),
  PositionControllers.updatePosition
);
router.patch(
  "/update-status/:id",
  validateRequest(updatePositionStatusAndTerminationMessageValidationSchema),
  PositionControllers.updatePositionStatusAndTerminationMessage
);

export const PositionRoute = router;

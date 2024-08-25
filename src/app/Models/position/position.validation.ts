import { z } from "zod";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const durationPattern = /^(?:\d+d|\d+h|\d+m)$/;

export const createPositionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    status: z
      .enum(["pending", "live", "terminated", "closed"])
      .default("pending"),
    creator: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    terminationMessage: z.string().optional(),
    maxVotes: z.number().int().positive(),
    maxCandidate: z.number().int().positive(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updatePositionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    maxVotes: z.number().int().positive().optional(),
    maxCandidate: z.number().int().positive().optional(),
  }),
});

const validatePositionStatusAndTerminationMessage = (data: any) => {
  if (data.status === "terminated" && !data.terminationMessage) {
    return "Termination message is required when status is terminated.";
  }
  if (data.status !== "terminated" && data.terminationMessage) {
    return "Termination message should not be provided when status is not terminated.";
  }
  return null; // No error
};

export const updatePositionStatusAndTerminationMessageValidationSchema =
  z.object({
    body: z
      .object({
        status: z.enum(["pending", "live", "terminated", "closed"]).optional(),
        terminationMessage: z.string().optional(),
      })
      .refine((data) => {
        const errorMessage = validatePositionStatusAndTerminationMessage(data);
        if (errorMessage) {
          throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
        }
        return true;
      }),
  });

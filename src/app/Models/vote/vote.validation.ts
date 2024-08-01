import { z } from "zod";

export const voteValidationSchema = z.object({
  body: z.object({
    voter: z.string(),
    email: z.string().email(),
    candidate: z.string(),
    position: z.string(),
  }),
});

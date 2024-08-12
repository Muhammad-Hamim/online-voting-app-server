import crypto from "crypto";
export const generateRandomPassword = (length: number) => {
  return crypto.randomBytes(length).toString("hex");
};

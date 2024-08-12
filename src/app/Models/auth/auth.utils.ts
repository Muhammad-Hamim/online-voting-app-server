import { TJwtPayload } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
export const generateToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn });
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

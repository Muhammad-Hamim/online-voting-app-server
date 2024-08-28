import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import multer from "multer";

cloudinary.config({
  cloud_name: config.CLOUDINARY_COULD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const sendImgToCloudinary = async (imageName: string, buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: imageName },
      (error, result) => {
        if (error) {
          reject(new AppError(httpStatus.BAD_REQUEST, "Failed to upload photo"));
        } else if (result) {
          resolve(result.secure_url);
        }
      }
    );

    // Pipe the buffer into the upload stream
    uploadStream.end(buffer);
  });
};
// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

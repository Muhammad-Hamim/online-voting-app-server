import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import fs from "fs";
import multer from "multer";

cloudinary.config({
  cloud_name: config.CLOUDINARY_COULD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const sendImgToCloudinary = (imageName: string, path: string) => {
  return (async function () {
    try {
      // Upload an image
      const uploadResult = await cloudinary.uploader.upload(path, {
        public_id: imageName,
      });
      fs.unlink(path, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("file is deleted");
        }
      });
      //return the uploaded img link
      return uploadResult;
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to upload photo");
    }
  })();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     // Upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     // remove the locally saved temporary file as the upload operation failed
//     fs.unlinkSync(localFilePath);
//     return null;
//   }
// };

const uploadOnCloudinary = async (fileData) => {
  try {
    if (!fileData) return null;
    // Upload the file data on Cloudinary
    const dataUrl = `data:${
      fileData.mimetype
    };base64,${fileData.buffer.toString("base64")}`;
    const response = await cloudinary.uploader.upload(dataUrl, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    console.log("Upload to Cloudinary failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };

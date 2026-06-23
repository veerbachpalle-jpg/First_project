import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto"
    })

    console.log("file uploaded successfully on cloundinary", response.secure_url);
    if (fs.existsSync(localfilePath)) {
      fs.unlinkSync(localfilePath);
    }
    return response;
  } catch (error) {
    console.log("Cloudinary error:", error);

    if (fs.existsSync(localfilePath)) {
      fs.unlinkSync(localfilePath);
    }
  }
}
export { uploadOnCloudinary }
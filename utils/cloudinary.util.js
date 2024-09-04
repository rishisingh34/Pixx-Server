const cloudinary = require("cloudinary").v2;
const {
  CLOUD_NAME,
  CLOUD_API_SECRET,
  CLOUD_API_KEY,
} = require("../config/env.config");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) {
      return { error: "File path  not provided" };
    }
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    return response;
  } catch (err) {
    console.error(err);
    return { error: "Failed to upload to Cloudinary" };
  }
};

module.exports = uploadOnCloudinary;
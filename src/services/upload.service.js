const cloudinary = require("../config/cloudinary.config")
const fs = require("fs");

module.exports = {
  uploadToCloudinaryMobile: async (localFilePath) => {
    try {
      const result = await cloudinary.uploader.upload(localFilePath);

      fs.unlinkSync(localFilePath);
      return result.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

const { createImageObject } = require("../utils/uploadImageS3");
const cloudinary = require("../config/cloudinary.config");
const { upload } = require("../middlewares/uploadMiddlewares");
const { uploadToCloudinaryMobile } = require("../services/upload.service");

module.exports = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

      const fileName = `${Date.now()}_${req.file.originalname}`;
      console.log('Filename: ', fileName)

      const uploadResult = await createImageObject(req.file.buffer, fileName);

      if (!uploadResult) {
        return res.status(500).json({ message: "Failed to upload new image." });
      }

      console.log('uploadResult.url: ', uploadResult.url)

      return res.json({ success: true, url: uploadResult.url });

    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
  uploadImageCloudinary: async (req, res) => {
    const base64 = req.body.imageBase64;

    if (!base64 || !base64.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    try {
      const result = await cloudinary.uploader.upload(base64);

      // res.json({ url: result.secure_url });
      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed', detail: error.message });
    }
  },
  uploadImageCloudinaryMobile: async (req, res) => {
    try {
      const filePath = req.file.path;
      const imageUrl = await uploadToCloudinaryMobile(filePath);
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
}
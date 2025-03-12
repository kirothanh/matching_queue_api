const { createImageObject } = require("../utils/uploadImageS3");

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
  }
}
const express = require("express");
const router = express.Router();
const authRouter = require("../v1/authRoute");
const profileRouter = require("../v1/profileRoute");
const { isAuthorized } = require("../../middlewares/authMiddlewares");
const { upload } = require("../../middlewares/uploadMiddlewares");
const { putImageObject } = require("../../utils/uploadImageS3");

/** Check APIs api/v1/status */
router.get('/status', (req, res) => {
  res.status(200).json({ message: 'APIs V1 are ready to use.' })
})

// Auth API
router.use('/auth', authRouter);

router.use('/profile', isAuthorized, profileRouter);

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileName = `${Date.now().toString()}_${req.file.originalname}`;
    const uploadResult = await putImageObject(req.file.buffer, fileName);

    if (!uploadResult) {
      return res.status(500).json({ message: "Failed to upload file to S3." });
    }

    res.status(200).json({
      message: 'Upload successful',
      fileUrl: uploadResult.url,
      key: uploadResult.key,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router
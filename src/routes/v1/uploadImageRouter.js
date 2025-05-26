const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploadImageController = require("../../controllers/uploadImage.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");

const uploadCL = multer();

router.post("/", upload.single("image"), uploadImageController.uploadImage)
router.post("/cloudinary", uploadCL.none(), uploadImageController.uploadImageCloudinary)

module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploadImageController = require("../../controllers/uploadImage.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");

const uploadCL = multer();
const uploadMobile = multer({ dest: 'uploads/' });

router.post("/", upload.single("image"), uploadImageController.uploadImage)
router.post("/cloudinary", uploadCL.none(), uploadImageController.uploadImageCloudinary)
router.post("/cloudinary/mobile", uploadMobile.single('image'), uploadImageController.uploadImageCloudinaryMobile)

module.exports = router;
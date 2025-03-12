const express = require("express");
const router = express.Router();
const uploadImageController = require("../../controllers/uploadImage.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");

router.post("/", upload.single("image"), uploadImageController.uploadImage)

module.exports = router;
const express = require("express");
const profileController = require("../../controllers/profile.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");
const router = express.Router();

router.get("/", profileController.getProfile);
router.post("/update", upload.single("avatar"), profileController.updateProfile);

module.exports = router;
const express = require("express");
const clubController = require("../../controllers/club.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");
const router = express.Router();

router.get("/", clubController.getClubs);
router.post("/create", upload.single("imageUrl"), clubController.createClub);

module.exports = router;
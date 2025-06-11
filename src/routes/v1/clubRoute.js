const express = require("express");
const clubController = require("../../controllers/club.controller");
const { upload } = require("../../middlewares/uploadMiddlewares");
const router = express.Router();

router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClubById);
router.post("/create", upload.single("imageUrl"), clubController.createClub);
router.post("/create-mobile", clubController.createClubMobile);

module.exports = router;
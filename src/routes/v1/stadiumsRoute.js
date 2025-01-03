const express = require("express");
const router = express.Router();
const stadiumsController = require("../../controllers/stadiums.controller");
const { checkRole } = require("../../middlewares/roleMiddleware");
const { UserRole } = require("../../constant/enums");
const { upload } = require("../../middlewares/uploadMiddlewares");

router.get("/", stadiumsController.getStadiums);

router.use(checkRole(UserRole.ADMIN));
router.get("/:id", stadiumsController.getStadiumDetail);
router.post("/create", upload.single("image"), stadiumsController.createStadium);
router.patch("/update/:id", upload.single("image"), stadiumsController.updateStadium);
router.delete("/delete/:id", upload.single("image"), stadiumsController.deleteStadium);

module.exports = router;
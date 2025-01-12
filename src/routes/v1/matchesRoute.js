const express = require("express");
const matchesController = require("../../controllers/matches.controller");
const router = express.Router();

router.get("/", matchesController.getMatches);
router.get("/manage-match", matchesController.manageMatchesByUser)
router.post("/create", matchesController.createMatch);
router.post("/join", matchesController.joinMatch);

module.exports = router;
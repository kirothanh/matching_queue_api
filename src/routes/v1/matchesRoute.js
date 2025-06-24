const express = require("express");
const matchesController = require("../../controllers/matches.controller");
const router = express.Router();

router.get("/", matchesController.getMatches);
router.get("/manage-match", matchesController.manageMatchesByUser)
router.delete("/manage-match/:matchId", matchesController.deleteMatchByUser)
router.post("/create", matchesController.createMatch);
router.post("/join", matchesController.joinMatch);
router.post("/confirm-partner", matchesController.confirmPartnerInMatch);
router.get("/:id", matchesController.getMatchDetail);

module.exports = router;
const express = require("express");
const matchesController = require("../../controllers/matches.controller");
const router = express.Router();

router.post("/create", matchesController.createMatch);

module.exports = router;
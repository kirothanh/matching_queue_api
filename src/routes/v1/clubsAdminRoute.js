const express = require("express");
const router = express.Router();
const clubsAdminController = require("../../controllers/clubsAdmin.controller");

router.get("/", clubsAdminController.getClubs);

module.exports = router;
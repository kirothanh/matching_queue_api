const express = require("express");
const router = express.Router();
const stadiumsRoute = require("../v1/stadiumsRoute");

router.use("/stadiums", stadiumsRoute)

module.exports = router;
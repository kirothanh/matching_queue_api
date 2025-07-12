const express = require("express");
const router = express.Router();
const stadiumsRoute = require("../v1/stadiumsRoute");
const usersAdminRoute = require("../v1/usersAdminRoute");

router.use("/stadiums", stadiumsRoute)
router.use("/users", usersAdminRoute)

module.exports = router;
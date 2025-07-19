const express = require("express");
const router = express.Router();
const stadiumsRoute = require("../v1/stadiumsRoute");
const usersAdminRoute = require("../v1/usersAdminRoute");
const clubsAdminRoute = require("../v1/clubsAdminRoute");

router.use("/stadiums", stadiumsRoute);
router.use("/users", usersAdminRoute);
router.use("/clubs", clubsAdminRoute);

module.exports = router;
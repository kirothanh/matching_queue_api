const express = require("express");
const router = express.Router();
const authRouter = require("../v1/authRoute");
const adminRouter = require("../v1/adminRoute");
const clubRouter = require("../v1/clubRoute");
const matchesRouter = require("../v1/matchesRoute");
const profileRouter = require("../v1/profileRoute");
const { isAuthorized } = require("../../middlewares/authMiddlewares");

/** Check APIs api/v1/status */
router.get('/status', (req, res) => {
  res.status(200).json({ message: 'APIs V1 are ready to use.' })
})

// Auth API
router.use('/auth', authRouter);

// Client
router.use('/profile', isAuthorized, profileRouter);
router.use('/club', isAuthorized, clubRouter);
router.use('/matches', isAuthorized, matchesRouter);

// Admin
router.use('/admin', isAuthorized, adminRouter)

module.exports = router
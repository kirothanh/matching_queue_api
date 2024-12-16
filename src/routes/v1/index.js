const express = require("express");
const router = express.Router();
const authRouter = require("../v1/authRoute");

/** Check APIs api/v1/status */
router.get('/status', (req, res) => {
  res.status(200).json({ message: 'APIs V1 are ready to use.' })
})

// Auth API
router.use('/auth', authRouter);

module.exports = router
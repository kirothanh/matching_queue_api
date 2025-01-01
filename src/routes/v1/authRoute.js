const express = require("express");
const authController = require("../../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.delete("/logout", authController.logout);
router.put("/refresh_token", authController.refreshToken);
router.post("/verify-otp", authController.verifyOTP);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
// Login by Google
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.googleCallback);

module.exports = router;
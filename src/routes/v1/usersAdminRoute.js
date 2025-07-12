const express = require("express");
const router = express.Router();
const usersAdminController = require("../../controllers/usersAdmin.controller");

router.get("/", usersAdminController.getUsers);
router.get("/:id", usersAdminController.getUserById);
router.post("/", usersAdminController.createUser);
router.patch("/:id", usersAdminController.updateUser);
router.delete("/delete/:id", usersAdminController.deleteUser);

module.exports = router;
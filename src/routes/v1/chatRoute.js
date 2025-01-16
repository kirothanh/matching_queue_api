const express = require("express");
const chatController = require("../../controllers/chat.controller");
const router = express.Router();

router.post('/sendMessagesGroup', chatController.sendMessagesGroup)
router.get('/room/:id', chatController.getAllMessagesInRoom)

module.exports = router;
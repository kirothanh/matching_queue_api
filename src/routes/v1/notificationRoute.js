const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();

router.get("/", notificationController.getNotifications);
router.get("/:userId", notificationController.getNotificationDetail);
router.post("/create", notificationController.createNotification);
router.put("/:userId", notificationController.updateReadedNoti);
router.delete("/:userId", notificationController.deleteNotification);

module.exports = router;

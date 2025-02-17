const notificationService = require("../services/notification.service")

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const result = await notificationService.getAllNotifications()

      return res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Get notifications failed",
        errors: error.message,
      });
    }
  },
  getNotificationDetail: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('first userId: ', userId);
      const result = await notificationService.getAllNotificationDetail(userId)

      return res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Get notification detail failed",
        errors: error.message
      });
    }
  },
  createNotification: async (req, res) => {
    try {
      const { userId, title } = req.body;
      const result = await notificationService.createNotification(userId, title)

      return res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Create notification failed",
        errors: error.message,
      });
    }
  },
  updateReadedNoti: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await notificationService.updateReadedNoti(userId)

      if (!result) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Update readed notification failed",
        errors: error.message
      });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await notificationService.deleteNotification(userId)

      if (!result) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Delete notification failed",
        errors: error.message
      });
    }
  }
}
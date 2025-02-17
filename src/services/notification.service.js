const { Notification } = require("../models/index");

const getAllNotifications = async () => {
  try {
    const notifications = await Notification.findAll();

    if (!notifications) {
      return {
        success: false,
        message: "Notifications not found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Get notifications successfully",
      data: notifications,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllNotificationDetail = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        user_id: userId,
      },
    });

    if (!notifications) {
      return {
        success: false,
        message: "Notifications not found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Get notifications successfully",
      data: notifications,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const createNotification = async (userId, title) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
    });

    if (!notification) {
      return {
        success: false,
        message: "Create notification failed",
        data: {},
      };
    }

    return {
      success: true,
      message: "Create notification successfully",
      data: notification,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateReadedNoti = async (userId) => {
  try {
    const notifications = await Notification.update(
      {
        is_read: true,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );

    if (!notifications) {
      return {
        success: false,
        message: "Update readed notification failed",
        data: [],
      };
    }

    return {
      success: true,
      message: "Update readed notification successfully",
      data: notifications,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteNotification = async (userId) => {
  try {
    const notification = await Notification.destroy({
      where: {
        user_id: userId,
      },
    });

    if (!notification) {
      return {
        success: false,
        message: "Delete notification failed",
        data: {},
      };
    }

    return {
      success: true,
      message: "Delete notification successfully",
      data: notification,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getAllNotifications,
  getAllNotificationDetail,
  createNotification,
  updateReadedNoti,
  deleteNotification
};

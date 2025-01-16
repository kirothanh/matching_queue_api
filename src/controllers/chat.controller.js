const { Chat, User } = require("../models/index");

module.exports = {
  sendMessagesGroup: async (req, res) => {
    try {
      const { roomId, message, senderId } = req.body;

      if (!roomId || !message || !senderId) {
        return res.status(400).json({
          success: false,
          message: "Miss fields roomId, message or senderId"
        })
      }

      const createdNewMessage = await Chat.create({
        message,
        senderId,
        roomId
      })

      if (!createdNewMessage) {
        return res.status(500).json({
          success: false,
          message: "Create message failed"
        })
      }

      const sender = await User.findByPk(senderId, {
        attributes: ['id', 'name', 'avatar', 'email']
      });

      const messageWithUser = {
        ...createdNewMessage.toJSON(),
        sender
      };

      let editRoomId = `match_${roomId}`

      _io.to(editRoomId).emit('new_message', messageWithUser);

      return res.status(201).json({
        success: true,
        message: "Create message successfully",
        data: messageWithUser
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Send messages failed",
        errors: error.message,
      });
    }
  },
  getAllMessagesInRoom: async (req, res) => {
    try {
      const { id: roomId } = req.params;

      const messages = await Chat.findAll({
        where: { roomId },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        order: [['created_at', 'ASC']]
      })

      return res.status(200).json({
        success: true,
        data: messages
      });

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Failed to get messages"
      });
    }
  }
}
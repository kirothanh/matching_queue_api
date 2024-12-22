const { User } = require("../models/index");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.userId;

      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: "Get profile successfully",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get profile failed",
        errors: error.message
      })
    }
  }
}
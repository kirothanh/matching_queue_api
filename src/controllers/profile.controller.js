const { User } = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const { putImageObject } = require("../utils/uploadImageS3");
const { hashPassword } = require("../utils/hash");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.userId;

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: "Get profile successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get profile failed",
        errors: error.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      // Receive data from front-end
      const { name, email, phone, oldKey } = req.body;
      // Get userId from auth middleware
      const userId = req.userId;

      const updateData = { name, email, phone };

      // Upload new image
      if (req.file) {
        const fileName = `${uuidv4()}`;
        const uploadResult = await putImageObject(
          req.file.buffer,
          fileName,
          oldKey
        );

        if (!uploadResult) {
          return res.status(500).json({ message: "Failed to upload new image." });
        }

        updateData.avatar = uploadResult.url;
      }

      // Update user profile
      const updatedUser = await User.update(updateData, {
        where: {
          id: userId,
        },
        returning: true,
      });

      // Check if user is updated
      if (updatedUser[0] === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found or no changes made.",
        });
      }

      // Return response
      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: updatedUser[1][0],
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  updateProfileMobile: async (req, res) => {
    try {
      const { name, email, phone, avatar } = req.body;
      const userId = req.userId;

      const updateData = { name, email, phone, avatar };

      const updatedUser = await User.update(updateData, {
        where: {
          id: userId,
        },
        returning: true,
      });

      if (updatedUser[0] === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found or no changes made.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: updatedUser[1][0],
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { newPassword } = req.body;
      const userId = req.userId;

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.password = hashPassword(newPassword);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Reset password successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
};

const { User } = require("../models/index");
const { hashPassword } = require("../utils/hash");
const { uploadImageCloudinary } = require("./uploadImage.controller");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Get a user successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get a user failed",
        errors: error.message,
      });
    }
  },
  createUser: async (req, res) => {
    try {
      const { name, email, phone, avatar } = req.body;

      const user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const newUser = await User.create({ name, email, phone, avatar, password: hashPassword('123456'), role: 2 });

      return res.status(200).json({
        success: true,
        message: "Create a user successfully",
        data: newUser,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Create a user failed",
        errors: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, phone, avatar } = req.body;

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await User.update({ name, email, phone, avatar }, { where: { id: userId } });

      return res.status(200).json({
        success: true,
        message: "Update a user successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update a user failed",
        errors: error.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const deletedUser = await User.destroy({ where: { id: userId } });

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Delete a user successfully",
        data: deletedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete a user failed",
        errors: error.message,
      });
    }
  },
};

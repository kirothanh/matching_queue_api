const { v4: uuidv4 } = require("uuid");
const { Club } = require("../models/index");
const { putImageObject, createImageObject } = require("../utils/uploadImageS3");

module.exports = {
  getClubs: async (req, res) => {
    try {
      const userId = req.userId;

      const clubs = await Club.findAll({
        where: {
          createdBy: userId,
        },
      });

      if (!clubs) {
        return res.status(404).json({
          success: false,
          message: "Clubs not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Get clubs successfully",
        data: clubs,
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get clubs failed",
        errors: error.message,
      });
    }
  },
  getClubById: async (req, res) => {
    try {
      const { id } = req.params;

      const club = await Club.findAll({
        where: {
          createdBy: id,
        },
      });

      if (!club) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội bóng",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy dự liệu đội bóng thành công",
        data: club,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get club by id failed",
        errors: error.message,
      });
    }
  },
  createClub: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, description } = req.body;
      const newData = { name, description, createdBy: userId };

      if (req.file) {
        const fileName = `${uuidv4()}`;
        const uploadResult = await createImageObject(
          req.file.buffer,
          fileName,
        );

        if (!uploadResult) {
          return res.status(500).json({ message: "Failed to upload new image." });
        }

        newData.imageUrl = uploadResult.url;

        const createdClub = await Club.create(newData);

        if (!createdClub) {
          return res.status(500).json({ message: "Failed to create new club." });
        }

        return res.status(201).json({
          success: true,
          message: "Create new club successfully",
          data: createdClub,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Create new club failed",
        errors: error.message,
      });
    }
  },
  createClubMobile: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, description, image: imageUrl } = req.body;
      const newData = { name, description, imageUrl, createdBy: userId };

      const createdClub = await Club.create(newData);

      if (!createdClub) {
        return res.status(500).json({ message: "Lỗi khi tạo đội bóng" });
      }

      return res.status(201).json({
        success: true,
        message: "Tạo đội bóng thành công",
        data: createdClub,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tạo đội bóng thất bại",
        errors: error.message,
      });
    }
  }
}
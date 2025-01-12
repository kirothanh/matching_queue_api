const { Stadium, Provinces, Districts, Wards } = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const { putImageObject, createImageObject } = require("../utils/uploadImageS3");

module.exports = {
  getStadiums: async (req, res) => {
    try {
      const stadiums = await Stadium.findAll({
        include: [
          {
            model: Provinces,
            as: "province",
            attributes: ["id", "name"],
          },
          {
            model: Districts,
            as: "district",
            attributes: ["id", "name"],
          },
          {
            model: Wards,
            as: "ward",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Get all stadiums successfully",
        data: stadiums,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get stadiums failed",
        errors: error.message,
      });
    }
  },
  getStadiumDetail: async (req, res) => {
    try {
      const stadiumId = req.params.id;
      const stadium = await Stadium.findOne({
        where: {
          id: stadiumId,
        },
      });

      if (!stadium) {
        return res.status(404).json({
          success: false,
          message: "Stadium not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Get stadium detail successfully",
        data: stadium,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get stadium detail failed",
        errors: error.message,
      });
    }
  },
  createStadium: async (req, res) => {
    try {
      const userId = req.userId;
      let { name, address, province, district, ward } = req.body;
      province = Number(province);
      district = Number(district);
      ward = Number(ward);

      const newStadium = {
        name,
        address,
        province_id: province,
        district_id: district,
        ward_id: ward,
        user_id: userId,
      };

      if (req.file) {
        const fileName = `${uuidv4()}`;
        const uploadResult = await createImageObject(req.file.buffer, fileName);

        if (!uploadResult) {
          return res.status(500).json({ message: "Failed to upload new image." });
        }

        newStadium.image = uploadResult.url;
      }

      const createdStadium = await Stadium.create(newStadium);

      return res.status(201).json({
        success: true,
        message: "Post a stadium successfully",
        data: createdStadium,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Post a stadium failed",
        errors: error.message,
      });
    }
  },
  updateStadium: async (req, res) => {
    try {
      const { name, address, province, district, ward, image, oldKeyUrl } = req.body;
      const stadiumId = req.params.id;

      const updateStadiumData = {
        name,
        address,
        province_id: +province,
        district_id: +district,
        ward_id: +ward,
      };

      if (req.file) {
        const fileName = `${uuidv4()}`;
        const uploadResult = await putImageObject(
          req.file.buffer,
          fileName,
          oldKeyUrl,
        );

        if (!uploadResult) {
          return res.status(500).json({ message: "Failed to upload new image." });
        }

        updateStadiumData.image = uploadResult.url;
      }

      const updatedStadium = await Stadium.update(updateStadiumData, {
        where: {
          id: stadiumId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Update a stadium successfully",
        data: updatedStadium,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update a stadium failed",
        errors: error.message,
      });
    }
  },
  deleteStadium: async (req, res) => {
    try {
      const stadiumId = req.params.id;

      const deletedStadium = await Stadium.destroy({
        where: {
          id: stadiumId,
        },
      });

      if (!deletedStadium) {
        return res.status(404).json({
          success: false,
          message: "Stadium not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Delete a stadium successfully",
        data: deletedStadium,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete a stadium failed",
        errors: error.message,
      });
    }
  },
};

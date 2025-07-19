const { Club } = require("../models/index");

module.exports = {
  getClubs: async (req, res) => {
    try {
      const clubs = await Club.findAll();

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
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get clubs failed",
        errors: error.message,
      });
    }
  },
};
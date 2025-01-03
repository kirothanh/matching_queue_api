const { Match } = require("../models/index");

module.exports = {
  createMatch: async (req, res) => {
    const userId = req.userId;

    try {
      const {
        stadium_id,
        club_id,
        matchDate,
        contactNumber,
        description,
      } = req.body;

      console.log(req.body);

      if (
        !stadium_id ||
        !club_id ||
        !matchDate ||
        !contactNumber
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const newMatch = {
        stadium_id: parseInt(stadium_id, 10),
        club_id: parseInt(club_id, 10),
        matchDate,
        contactNumber,
        createdBy: userId,
        description,
      };

      const createdMatch = await Match.create(newMatch);

      if (!createdMatch) {
        return res.status(500).json({
          success: false,
          message: "Create match failed",
        });
      }

      res.status(201).json({
        success: true,
        message: "Create match successfully",
        data: newMatch,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

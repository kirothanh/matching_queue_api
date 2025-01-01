
const { User } = require("../models/index");
const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;

      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      const userRole = +user?.role;

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "User role not found. Access denied.",
        });
      }

      if (userRole !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have role`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
        errors: error.message,
      });
    }
  }
}

module.exports = {
  checkRole
}
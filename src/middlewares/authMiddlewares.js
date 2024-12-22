const { verifyAccessToken } = require("../utils/jwt");

module.exports = {
  isAuthorized: async (req, res, next) => {
    let accessTokenFromHeader = req.headers.authorization;

    if (accessTokenFromHeader?.startsWith('Bearer ')) {
      accessTokenFromHeader = accessTokenFromHeader.slice(7, accessTokenFromHeader.length);
    }

    if (!accessTokenFromHeader) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! (Token Not Found)'
      });
    }

    try {
      const { userId } = await verifyAccessToken(accessTokenFromHeader);
      req.userId = userId;
      next();
    } catch (error) {
      if (error.message?.includes('jwt expired')) {
        return res.status(410).json({
          message: 'Need to refresh token'
        })
      }

      return res.status(401).json({ message: 'Unauthorized! Please Login!' })
    }
  }
};
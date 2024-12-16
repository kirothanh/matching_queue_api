const isAuthorized = async (req, res, next) => {
  const accessTokenFromHeader = req.headers.authorization;

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

export const authMiddleware = {
  isAuthorized
}
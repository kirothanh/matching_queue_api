const redis = require("../utils/redis");

module.exports = {
  redisConnect: async (req, res, next) => {
    await redis.connect();
    req.redis = redis;
    next();
  }
}
const { getUserByEmail } = require("../services/auth.service");
const { comparePassword, hashPassword } = require("../utils/hash");
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const redis = require("../utils/redis");
const { UserRole } = require("../constant/enums");
const { User } = require("../models/index");
const { successResponse, errorResponse } = require("../utils/response");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user = await getUserByEmail(email);

      if (!comparePassword(password, user.password)) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }

      const accessToken = createAccessToken({ userId: user.id });
      const refreshToken = createRefreshToken(user.id);

      await redis.connect();
      await redis.set(`RefreshToken:${refreshToken}`, refreshToken);
      await redis.close();

      return successResponse({
        res,
        message: "Login successfully",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: "Login failed",
        errors: error.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        role = UserRole.USER,
        password,
      } = req.body;

      if (!req.body) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const checkEmailExist = await getUserByEmail(email);

      if (checkEmailExist) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const newUser = await User.create({
        name: name,
        email: email,
        phone: phone,
        role: role,
        password: hashPassword(password),
      });

      const accessToken = createAccessToken({ userId: newUser.id });
      const refreshToken = createRefreshToken(newUser.id);

      return successResponse({
        res,
        message: "Login successfully",
        data: {
          newUser,
          accessToken,
          refreshToken,
        },
      });

    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: "Register failed",
        errors: error.message,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        return errorResponse({
          res,
          status: 400,
          message: "Access token is missing",
        });
      }

      await redis.connect();
      await redis.set(`Blacklist: ${accessToken}`, accessToken)
      await redis.close()

      return successResponse({
        res,
        message: "Logout successfully"
      })
    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: "Logout failed",
        errors: error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const { userId } = await verifyRefreshToken(refreshToken);

      await redis.connect();
      const tokenFromRedis = await redis.get(`RefreshToken:${refreshToken}`)
      await redis.close()
      if (!tokenFromRedis) {
        throw new Error("Refresh token not found")
      }

      const accessTokenNew = createAccessToken({ userId });

      return successResponse({
        res,
        data: {
          accessTokenNew,
          refreshToken
        },
        message: "Refresh token successfully",
      })
    } catch (error) {
      return errorResponse({
        res,
        status: 401,
        message: "Refresh token failed",
        errors: error.message
      })
    }
  }
}

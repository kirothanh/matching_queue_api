const { getUserByEmail } = require("../services/auth.service");
const { comparePassword, hashPassword } = require("../utils/hash");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const redis = require("../utils/redis");
const { UserRole } = require("../constant/enums");
const { User } = require("../models/index");
const { successResponse, errorResponse } = require("../utils/response");
const { registerSchema, loginSchema } = require("../utils/validate");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      await loginSchema.validate(req.body, { abortEarly: false });

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
      if (error.name === "ValidationError") {
        const validationErrors = error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      return errorResponse({
        res,
        status: 200,
        message: "Email or password is incorrect",
        errors: error.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Validate input
      await registerSchema.validate(req.body, { abortEarly: false });

      const newUser = {
        name,
        email,
        phone,
        role: +UserRole.USER,
        password: hashPassword(password),
      };

      if (!req.body) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      // Check tài khoản tồn tại không
      const checkEmailExist = await User.findOne({
        where: {
          email: newUser.email,
        },
      });

      if (checkEmailExist) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const createdUser = await User.create(newUser);

      const accessToken = createAccessToken({ userId: createdUser.id });
      const refreshToken = createRefreshToken(createdUser.id);

      return successResponse({
        res,
        message: "Login successfully",
        data: {
          createdUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      return errorResponse({
        res,
        status: 200,
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
      await redis.set(`Blacklist: ${accessToken}`, accessToken);
      await redis.close();

      return successResponse({
        res,
        message: "Logout successfully",
      });
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
      const tokenFromRedis = await redis.get(`RefreshToken:${refreshToken}`);
      await redis.close();
      if (!tokenFromRedis) {
        throw new Error("Refresh token not found");
      }

      const accessTokenNew = createAccessToken({ userId });

      return successResponse({
        res,
        data: {
          accessTokenNew,
          refreshToken,
        },
        message: "Refresh token successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        status: 401,
        message: "Refresh token failed",
        errors: error.message,
      });
    }
  },
  googleCallback: async (req, res) => {
    try {
      const [user, created] = await User.findOrCreate({
        where: {
          email: req.user.emails[0].value,
        },
        defaults: {
          name: req.user.displayName,
          email: req.user.emails[0].value,
          password: hashPassword(req.user.id),
          role: +UserRole.USER,
          avatar: req.user.photos[0]?.value,
        },
      });

      const accessToken = createAccessToken({ userId: user.id });
      const refreshToken = createRefreshToken(user.id);

      res.redirect(
        `${process.env.FRONTEND_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      return errorResponse({
        res,
        status: 401,
        message: "Login failed",
        errors: error.message,
      });
    }
  },
};

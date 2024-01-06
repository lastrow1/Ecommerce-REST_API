import Joi from "joi";
import user from "../../model/user.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";
import bcrypt from "bcrypt";
import RefreshToken from "../../model/refreshToken.js";

const loginController = {
  async login(req, res, next) {
    // Validate req.body
    const loginSchema = Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().required(),
    });

    const { error } = loginSchema.validate(req.body);
    // if there is any error during req.body
    if (error) {
      return next(error);
    }

    try {
      const User = await user.findOne({ email: req.body.email });
      if (!User) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Password_match
      const matchPassword = await bcrypt.compare(
        req.body.password,
        User.password
      );
      if (!matchPassword) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // USERNAME AND PASSWORD ARE MATCHED
      const token = JwtService.sign({ _id: User._id, role: User.role });
      const refreshToken = JwtService.sign(
        { id: User._id, role: User.role },
        "1y",
        process.env.JWT_REFRESH
      );

      const storeRefreshToken = await RefreshToken.create({
        token: refreshToken,
      });

      res.status(201).json({ accessToken: token, refreshToken });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    const refresSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refresSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });

      res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
};

export default loginController;

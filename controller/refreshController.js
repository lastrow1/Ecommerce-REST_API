import dotenv from "dotenv";
dotenv.config();

import Joi from "joi";
import JwtService from "../services/JwtService.js";
import RefreshToken from "../model/refreshToken.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import user from "../model/user.js";

const refreshController = {
  async refresh(req, res, next) {
    const refresSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refresSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // If there is no error...
    try {
      const isValidToken = await RefreshToken.find({
        token: req.body.refresh_token,
      });
      if (!isValidToken) {
        return next(CustomErrorHandler.unAuthorized());
      }

      const { id } = await JwtService.verify(
        isValidToken[0]?.token,
        process.env.JWT_REFRESH
      );
      const User = await user.findOne({ _id: id });

      if (!User) {
        return next(CustomErrorHandler.unAuthorized("Ohhh! invalid request"));
      }

      // Tokens...

      const token = JwtService.sign({ _id: User._id, role: User.role });
      const refreshToken = JwtService.sign(
        { id: User._id, role: User.role },
        "1y",
        process.env.JWT_REFRESH
      );

      const storeRefreshToken = await RefreshToken.create({
        token: refreshToken,
      });
      if (!storeRefreshToken) {
        return next(
          CustomErrorHandler.unAuthorized("Ufff! Dublicate refreshToken found")
        );
      }

      res.status(201).json({ accessToken: token, refreshToken });
    } catch (error) {
      return next(error.message);
    }
  },
};

export default refreshController;

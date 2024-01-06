import dotenv from "dotenv";
dotenv.config();
import Joi from "joi";
import customErrorHandler from "../services/CustomErrorHandler.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    msg: `Internal Server Error`,
    ...(process.env.DEBUG_MODE === "true" && {
      orignalError: err.message && err.stack,
    }),
  };
  if (err instanceof Joi.ValidationError) {
    statusCode = 422;
    data = {
      msg: err.message,
    };
  }

  if (err instanceof customErrorHandler) {
    statusCode = err.status;
    data = {
      msg: err.message,
    };
  }

  res.status(statusCode).json(data);
};

export default errorHandler;

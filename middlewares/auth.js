import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = (req, res, next) => {
  if (!req.headers.authorization)
    return next(CustomErrorHandler.unAuthorized());

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decode = JwtService.verify(token);

    const user = { id: decode._id, role: decode.role };

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export default auth;

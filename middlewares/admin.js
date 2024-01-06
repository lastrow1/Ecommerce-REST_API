import user from "../model/user.js"
import CustomErrorHandler from "../services/CustomErrorHandler.js";



const admin = async (req, res, next) => {
    try {

        const User = await user.findOne({ _id: req.user.id });

        if (User.role === 'admin') {
            next();
        }
        else {
            next(CustomErrorHandler.unAuthorized())
        }
    } catch (error) {
        next(error.message)
    }
}

export default admin;
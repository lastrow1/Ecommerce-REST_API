import dotenv from 'dotenv';
dotenv.config();
import Joi from 'joi';
import customErrorHandler from '../../services/CustomErrorHandler.js';
import user from '../../model/user.js';
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService.js'
import RefreshToken from '../../model/refreshToken.js'
const registerController = {

    async register(req, res, next) {

        try {
            // Validate req.body
            const registerSchema = Joi.object({
                name: Joi.string().strict().trim().min(5).max(20).required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                repeat_password: Joi.ref('password')
            });

            const { error } = registerSchema.validate(req.body);

            if (error) {
                return next(error)
            }

            const exist = await user.exists({ email: req.body.email });
            if (exist) {
                return next(customErrorHandler.alreadyExist('User already Exists'))
            }

            // Store data Inside database


            // Prepare Model

            const { name, email, password } = req.body;

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = {
                name,
                email,
                password : hashPassword
            }
            const User = await user.create(newUser);

            // Token 
        const accessToken = JwtService.sign({ id: User._id, role: User.role })
        const refreshToken = JwtService.sign({ id: User._id,  role: User.role }, '1y', process.env.JWT_REFRESH)

        // Store Token in Databse
         const storeRefreshToken = await RefreshToken.create({token:refreshToken})


            res.json({ accessToken, refreshToken })
        } catch (error) {
            return next(error)
        }

    }

}


export default registerController;
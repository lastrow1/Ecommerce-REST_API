import Jwt  from "jsonwebtoken";
import user from "../model/user.js"

const userController ={

    async me(req, res, next){

        try {

            const User = await user.findById(req.user.id)
            .select('-password -updatedAt -__v')
            if(!User){
                return next(CustomErrorHandler.notFound)
            }

            
            res.json({User})
        } catch (error) {
            return next(error)
        }

    }
    
}
export default userController;
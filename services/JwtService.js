import dotenv from 'dotenv';
dotenv.config();
import Jwt  from "jsonwebtoken";

const access_secret = process.env.JWT_SECRET;

class JwtService{
    static sign(payload, expiry='60s', secret=access_secret){
        return Jwt.sign(payload, secret, {expiresIn: expiry})
    }

    static verify(token, secret=access_secret){
        return Jwt.verify(token, secret)
    }
}



export default JwtService;
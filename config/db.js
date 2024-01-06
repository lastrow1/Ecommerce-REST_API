import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


export default function connectDB(){
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected..`);

    
    } catch (error) {
        console.log(error);
    }
}



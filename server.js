import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import router from './routes/index.js'
import errorHandler from './middlewares/ErrHandler.js'
import connectDB from './config/db.js';
// SERVER PORT
const PORT = process.env.PORT || 3000;
const app = express();

connectDB()
app.use(express.json());
app.use(express.urlencoded({extended:true}))



// MiddleWares
app.use('/api', router);

app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
})
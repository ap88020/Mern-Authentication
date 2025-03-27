import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";


import connectDB from "./config/mongodb.js";
import authRouter from './router/authRouter.js'
import userRouter from "./router/userRouter.js";

const app = express();
const port = process.env.PORT ||  3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

// api endpoints
app.get('/',(req,res) => {
    res.send("api is working");
})

app.use('/api/auth' , authRouter);
app.use('/api/user' , userRouter);

app.listen(port, ()=> {
     console.log(`Server is started is on port : ${port}`);
})
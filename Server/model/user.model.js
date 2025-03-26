import { verify } from "crypto";
import e from "express";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true,
    },
    email : {
        type:String,
        require:true,
        unique:true,
    },
    password : {
        type:String,
        require:true,
    },
    verifyOtp : {
        type:String,
        default:'',
    },
    verifyOtpExpireAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false,
    },
    resetOtp:{
        type:String,
        default:'',
    },
    resetOtpExpireAt:{
        type:Number,
        default:0,
    }
})


const userModel = mongoose.model.user || mongoose.model("user",userSchema);

export default userModel;


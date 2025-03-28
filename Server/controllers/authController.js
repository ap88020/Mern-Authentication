import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import userModel from "../model/user.model.js";
import { text } from "express";
import transporter from "../config/nodmailer.js";

export const register = async (req,res) => {
    let {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success : false , message : "Mising Details"});
    }

    try {
        const existingUser = await userModel.findOne({email : email});

        if(existingUser){
            return res.json({success : false , message : "email already exists"});
        }

        const hasPassword = await bcrypt.hash(password,10);

        const user = new userModel({
            name,
            email,
            password : hasPassword,
        })
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET , {expiresIn:"7d" });

        res.cookie("token", token , {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // Node-Mailer

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome To Auth-Stack",
            text:`Welcome to Auth-Stack website. Your account has been created with email id : ${email}`,
        }

        try {
            const info =  await transporter.sendMail(mailOption);
            // console.log("Info :" , info);
        } catch (mailError) {
            console.error("Email sending failed:", mailError);
        }
        

        return res.json({success : true});

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

export const login = async (req,res) => {
    let {email , password} = req.body;
    if(!email || !password) {
        return res.json({success : false , message : "Missing Details"});
    }

    try {
        const user = await userModel.findOne({email : email});
        if(!user){
            return res.json({success : false , message : "Invalid Email"});
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.json({success : false , message : "Invalid Password"});
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET, {expiresIn : '7d'});

        res.cookie("token", token , {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000,
        });
        
        return res.json({success : true});
    } catch (error) {
        return res.json({success : false , message : error.message});
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token", {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000,           
        })       

        return res.json({success : false , message : error.message});
    } catch (error) {
        return res.json({success : false , message : error.message});
    }
}

export const sendVerifyOtp = async (req,res) => {
    try {

        const {userId} = req.body;
    
        const user = await userModel.findById(userId);
    
        if(user.isAccountVerified) {
            return res.json({success : false , message: "Account already verified"}); 
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email, 
            subject : "Account Verification OTP",
            text:`your OTP is ${otp}. Verify your Account using this OTP.`,
        }

        await transporter.sendMail(mailOption);

        return res.json({success:true , message: "Verification address sent on Email"}); 
    } catch (error) {
        return res.json({success: false , message : error.message});
    }

}

export const  verifyEmail = async (req,res) => {
    const {userId , otp} = req.body;
    
    if(!userId || !otp) {
        return res.json({success:true , message : "Missing Details"});
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false , message : "User not found"});
        }

        if(!user.verifyOtp || String(user.verifyOtp) !== String(otp)){
            return res.json({success : false , message : "Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success : false , message : "OTP Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success : true , message : "Email Verified Successfully"});
        
    } catch (error) {
        return res.json({success: false, message : error.message});
    }
}

export const sendResetOtp = async (req,res) => {
    const {email} = req.body; 

    if(!email) {
        return res.json({success:false , message: "Email is required"});
    }

    try {
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.json({success:true, message:"User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000;

        user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to : user.email, 
            subject : "Password Reset OTP",
            text:`your OTP for reseting your password ${otp}. Use this OTP to proceed with resetting your password.`,
        }

        await transporter.sendMail(mailOption);

        return res.json({success: true , message:"OTP sent to your Email"})

    } catch (error) {
        return res.json({success:true , message : error.message});
    }
}

export const resetPassword = async (req,res) => {
    const {email , otp , newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success : false , message : "email , otp , newPassword is required"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false , message : "User Not Found"});
        }

        if(user.resetOtp == "" || user.resetOtp !== otp){
            return res.json({success:false , message : "InValid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success : false , message : "OTP Expired"});
        }

        const hasPassword = await bcrypt.hash(newPassword, 10);

        user.password = hasPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        
        await user.save();

        return res.json({success:true, message:"password has been reset successfully"});
    } catch (error) {
        return res.json({success:false , message : error.message});
    }
}
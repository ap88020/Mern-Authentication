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
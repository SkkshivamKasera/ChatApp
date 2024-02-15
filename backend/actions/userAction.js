import { sendError } from "../sendError.js"
import { User } from '../models/UserModel.js'
import bcrypt from "bcrypt"
import { sendToken } from "../sendToken.js"
import cloudinary from 'cloudinary'

export const signup = async (req, res) => {
    try{
        const { name, email, password, avatar } = req.body
        if(!name || !email || !password){
            return sendError(res, 400, "All fields are required")
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return sendError(res, 409, "User already exists")
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        let myCloudAvater
        if(avatar){
            const myCLoud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "chatapp"
            })
            myCloudAvater = myCLoud.secure_url
        }
        const user = await User.create({
            name, email, password: hashPassword, avatar: myCloudAvater
        })
        return sendToken(res, user, true, "signup successfully")
    }catch(error){
        return sendError(res, 500, error.message)
    }
}

export const login = async (req, res) => {
    try{
        const { email, password } = req.body
        if(!email || !password){
            return sendError(res, 400, "All fields are required")
        }
        const user = await User.findOne({email})
        if(!user){
            return sendError(res, 409, "Invalid email or password")
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched){
            return sendError(res, 409, "Invalid email or password")
        }
        return sendToken(res, user, true, "login successfully")
    }catch(error){
        return sendError(res, 500, error.message)
    }
}

export const myData = async (req, res) => {
    try{
        return res.status(200).json({ success: true, user: req.user })
    }catch(error){
        return sendError(res, 500, error.message)
    }
}

export const logout = async (req, res) => {
    try{
        return sendToken(res, null, false, "logout successfully")
    }catch(error){
        return sendError(res, 500, error.message)
    }
}

//search users
export const all_users = async (req, res) => {
    try{
        const queries = req.query
        const keyword = queries.search ? {
            $or: [
                { name: { $regex: queries.search, $options: "i" } },
                { email: { $regex: queries.search, $options: "i" } }
            ]
        } : {}
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
        res.status(200).json({ success: true, users })
    }catch(error){
        return sendError(res, 500, error.message)
    }
}
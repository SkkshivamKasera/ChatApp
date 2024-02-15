import { User } from "./models/UserModel.js"
import { sendError } from "./sendError.js"
import jwt from "jsonwebtoken"

export const isAuthentication = async (req, res, next) => {
    try{
        const { token } = req.cookies
        if(!token){
            return sendError(res, 400, "please login")
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const id = decode.id
        const user = await User.findById(id)
        if(!user){
            return sendError(res, 400, "Invalid User ID")
        }
        req.user = user
        next()
    }catch(error){
        return sendError(res, 500, error.message)
    }
}
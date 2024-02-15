import { Chat } from "../models/ChatModel.js"
import { Message } from "../models/MessageModel.js"
import { User } from "../models/UserModel.js"
import { sendError } from "../sendError.js"

export const sendMessage = async (req, res) => {
    try{
        const { content, chatId } = req.body
        if(!content || !chatId){
            return sendError(res, 400, "invalid data passed into request")
        }
        const newMessage = {
            sender: req.user?._id,
            content: content,
            chat: chatId
        }
        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name avatar")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email avatar"
        })
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })
        return res.status(200).json({ success: true, message })
    }catch(error){
        return sendError(res, 500, error.message)
    }
}

export const allMessage = async (req, res) => {
    try{
        const { chatId } = req.params
        const messages = await Message.find({ chat: chatId })?.populate("sender", "name email avatar").populate("chat")
        return res.status(200).json({ success: true, messages })
    }catch(error){
        return sendError(res, 500, error.message)
    }
}
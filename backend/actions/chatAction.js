import { sendError } from "../sendError.js"
import { Chat } from '../models/ChatModel.js'
import { User } from "../models/UserModel.js"

export const access_chat = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return sendError(res, 400, "UserId params not sent with request")
        }

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name avatar email"
        })

        if (isChat.length === 0) {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            }

            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            return res.status(200).json({ success: true, chat: fullChat })
        }

        return res.status(200).json({ success: true, chat: isChat[0] })

    } catch (error) {
        return sendError(res, 500, error.message)
    }
}

export const fetch_chat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name avatar email"
                })
                return res.status(200).json({ success: true, chat: results })
            })
    } catch (error) {
        return sendError(res, 500, error.message)
    }
}

export const create_group_chat = async (req, res) => {
    try{
        if(!req.body.users || !req.body.name){
            return sendError(res, 400, "please fill all the fields")
        }
        const users = JSON.parse(req.body.users)
        if(users.length < 2){
            return sendError(res, 400, "more than 2 users are required to form a group chat")
        }
        users.push(req.user)
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).json({ success: true, groupChat: fullGroupChat })
    }catch (error) {
        return sendError(res, 500, error.message)
    }
}

export const rename_group = async (req, res) => {
    try{
        const { chatId, chatName } = req.body
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        if(!updatedChat){
            return sendError(res, 404, "chat not found")
        }
        return res.status(200).json({ success: true, updatedChat })
    }catch (error) {
        return sendError(res, 500, error.message)
    }
}

export const add_to_group = async (req, res) => {
    try{
        const { chatId, userId } = req.body
        const addedUserInChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        if(!addedUserInChat){
            return sendError(res, 404, "chat not found")
        }
        return res.status(200).json({ success: true, addedUserInChat })
    }catch (error) {
        return sendError(res, 500, error.message)
    }
}

export const remove_to_group = async (req, res) => {
    try{
        const { chatId, userId } = req.body
        const removeUserInChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        if(!removeUserInChat){
            return sendError(res, 404, "chat not found")
        }
        return res.status(200).json({ success: true, removeUserInChat })
    }catch (error) {
        return sendError(res, 500, error.message)
    }
}
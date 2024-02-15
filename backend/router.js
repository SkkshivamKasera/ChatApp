import express from 'express'
import { all_users, login, logout, myData, signup } from './actions/userAction.js'
import { isAuthentication } from './middleware.js'
import { access_chat, add_to_group, create_group_chat, fetch_chat, remove_to_group, rename_group } from './actions/chatAction.js'
import { sendMessage, allMessage } from './actions/messageAction.js'

export const Router = express.Router()

//authentication apis
Router.route("/signup").post(signup)
Router.route("/login").post(login)
Router.route("/me").get(isAuthentication, myData)
Router.route("/logout").get(logout)

//search users
Router.route("/user/all").get(isAuthentication, all_users)

//chat apis
Router.route("/chat").post(isAuthentication, access_chat).get(isAuthentication, fetch_chat)
Router.route("/chat/group").post(isAuthentication, create_group_chat)
Router.route("/chat/group/rename").put(isAuthentication, rename_group)
Router.route("/chat/group/user/add").put(isAuthentication, add_to_group)
Router.route("/chat/group/user/remove").put(isAuthentication, remove_to_group)

//message apis
Router.route("/message/send").post(isAuthentication, sendMessage)
Router.route("/message/:chatId").get(isAuthentication, allMessage)
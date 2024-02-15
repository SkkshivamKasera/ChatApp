import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Database_Connection } from './config/database.js'
import { Router } from './router.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary';
import { Server } from 'socket.io'
import path from 'path'

dotenv.config({ path: "./backend/config/config.env" })
Database_Connection()

const app = express()
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on : http://localhost:${process.env.PORT}`)
})
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_DATABASE, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

app.use(express.json({
    limit: "50mb"
}))
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(cookieParser())
app.use("/api/v1", Router)

// -------------DEPLOYMENT----------------//

const dirName = path.resolve()
console.log(dirName)
if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static(path.join(dirName, "../frontend/build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirName, "../frontend/build/index.html"))
    })
}else{
    app.get("/", (req, res) => {
        res.send("Api is running")
    })
}

// -------------DEPLOYMENT----------------//


const io = new Server(server, {
    pingTimeout: 600000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on("connection", (socket) => {

    socket.on('setup', (userData) => {
        socket.join(userData?._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User join room " + room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if(!chat.users){
            return;
        }
        chat?.users?.forEach(user => {
            if(user._id === newMessageRecieved?.sender?._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved)
        })
        
        socket.off("setup", () => {
            socket.leave(userData._id)
        })
    })
})
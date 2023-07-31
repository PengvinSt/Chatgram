const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors')
const connectDB = require('./config/db')
const router = require('./routes/main-router.js');
const errorMiddleware = require('./utils/errorMiddleware.js');
const { Server } = require("socket.io");
const userSchema = require('./models/userSchema');
const path = require('path')
dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors(
    {
    credentials:true,
    origin: process.env.CLIENT_URL
    }
 ))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api', router)
app.use(errorMiddleware)


const start = async () => {
    let activeUsers = [];
    try {
        const server = app.listen(PORT, ()=>{console.log(`listening on port ${PORT}`)})
        connectDB()
        const io = new Server(server,{
            pingTimeout:60000,
            cors: {
                origin: process.env.CLIENT_URL,
                // credentials: true,
              },
        });
        // let tempUserData;
        io.on("connect", async (socket)=>{
            await userSchema.findByIdAndUpdate(socket.handshake.headers.userid, {
                isOnline:true
            })
            socket.join(socket.handshake.headers.userid)
            socket.emit("Connected")
            if (!activeUsers.some((user) => user.userId === socket.handshake.headers.userid)) {
                activeUsers.push({ userId: socket.handshake.headers.userid });
                console.log("New User Connected", activeUsers);
            } 
            io.emit("getOnlineUsers", activeUsers);
            socket.on('ChatStart',(room)=>{
                socket.join(room)
                console.log(`User successfully joined chat room ${room}`)
            })

            socket.on("SendMessage",(message)=>{
                let chat = message.chat
                if(chat !== null){
                    chat.users.forEach(user=>{
                        if(user._id === message.sender._id) return
                        socket.in(user._id).emit("GetMessage",message)
                    }) 
                } else{
                    socket.emit('SendMessageError', {message: "Chat is not exist"})
                }
                     
            })
            socket.on('Typing',(room)=>{
                socket.in(room).emit('Typing',room)
            })
            socket.on('NotTyping',(room)=>{
                socket.in(room).emit('NotTyping')
            })

            socket.on('disconnect', async () => {
                await userSchema.findByIdAndUpdate(socket.handshake.headers.userid, {
                    isOnline:false
                })
                activeUsers = activeUsers.filter((user) => user.userId !== socket.handshake.headers.userid);
                console.log("User Disconnected", activeUsers);
                io.emit("getOnlineUsers", activeUsers);
            });
        })       
    } catch (error) {
        console.log(error)
    }
}

start()


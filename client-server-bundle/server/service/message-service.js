const ApiError = require("../utils/apiError")
const chatSchema = require('../models/chatSchema.js');
const messageSchema = require('../models/messageSchema.js');
const userSchema = require('../models/userSchema.js');

class messageService {
    async sendMessage(content, chatId, loggedUserId){
        try {
            let newMessage = await messageSchema.create({sender:loggedUserId,content,chat:chatId})
            newMessage = await newMessage.populate("sender","name pic isOnline updatedAt")
            newMessage = await newMessage.populate("chat")
            newMessage = await userSchema.populate(newMessage, {path:"chat.users", select:"name pic email createdAt updatedAt"})
            await chatSchema.findByIdAndUpdate(chatId,{latestMessage:newMessage},{
                new: true,
            })
            return newMessage
        } catch (error) {
            next(error)
        }
    }

    async findChatMessages(chatId){
        try {
            let allMessages = await messageSchema.find({chat:chatId}).populate("sender","name pic email createdAt isOnline").populate("chat")
            return allMessages
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new messageService()

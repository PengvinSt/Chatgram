const chatSchema = require('../models/chatSchema.js');
const userSchema = require('../models/userSchema.js');
const messageSchema = require('../models/messageSchema.js');
const ApiError = require('../utils/apiError.js');


class ChatService {
    async accessChat(userId, loggedUserId){
        let isChatExist = await chatSchema.find({ 
            isGroupChat:false,
            $and: [
                {users: {$elemMatch:{$eq:loggedUserId}}},
                {users: {$elemMatch:{$eq:userId}}}
            ]
        }).populate('users', '-password').populate('latestMessage')

        isChatExist = await userSchema.populate(isChatExist, {
            path:'latestMessage.sender',
            select:'name pic email'
        })

        if (isChatExist.length > 0){
            return isChatExist[0]
        }else {
            let chatData = {
                chatName:"sender",
                isGroupChat:false,
                users:[loggedUserId,userId],
            }
            try {
                const createdChat = await chatSchema.create(chatData)
                const fullChat = await chatSchema.findById(createdChat._id).populate('users', '-password')
                return fullChat
            } catch (error) {
                next(error)
            }
        }
    }

    async getUserChats(loggedUserId) {
        try {
            let results = await chatSchema.find({ users:{$elemMatch:{$eq:loggedUserId}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt:-1})

            results = await userSchema.populate(results, {
                path:'latestMessage.sender',
                select:'name pic email'
            })
            return results
        } catch (error) {
            next(error)
        }
    }

    async createGroupChat(users, name, loggedUserId, pic){
        if(!users || !name){
            // return res.status(400).json({message:'Please fill all the fields'})
            throw new ApiError.BadRequestError('Please fill all the fields')
        }
        if(users.length < 2) {
            // return res.status(400).json({message:'Require more than one user to make group chat'})
            throw new ApiError.BadRequestError('Require more than one user to make group chat')
        }
        users.push(loggedUserId)
        const groupChat = await chatSchema.create({
            chatName:name,
            users,
            isGroupChat:true,
            groupAdmin:loggedUserId,
            pic
        })
        const newGroupChat = await chatSchema.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        return newGroupChat
    }
    
    async changeGroupChat(chatId, chatName, newPic){
        try {
            if(chatName.length !== 0){
                if(newPic !== undefined){
                    const updatedChat = await chatSchema.findByIdAndUpdate(
                        chatId,
                        {
                            chatName,
                            pic: `http://localhost:5000/${newPic}`
                        },
                        {
                            new: true,
                        }
                    ) 
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    return updatedChat
                }else{
                    const updatedChat = await chatSchema.findByIdAndUpdate(
                        chatId,
                        {
                            chatName,
                        },
                        {
                            new: true,
                        }
                    ) 
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    return updatedChat 
                }               
            }else{
                if(newPic !== undefined){
                    const updatedChat = await chatSchema.findByIdAndUpdate(
                        chatId,
                        {
                            pic: `http://localhost:5000/${newPic}`
                        },
                        {
                            new: true,
                        }
                    ) 
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                return updatedChat
                }else{
                    throw ApiError.BadRequestError(`No data was changed!`)
                }
            }   
                     
                
            
        } catch (error) {
            next(error)
        }
    }

    async addToGroupChat(chatId, userId){
        try {
            const addedUsers = await chatSchema.findByIdAndUpdate(chatId,
                {
                    $push:{users:userId}
                },{
                    new: true,
                })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                return addedUsers
        } catch (error) {
            next(error)
        }
    }

    async removeGroupChat(chatId, userId){
        try {
            const removedUsers = await chatSchema.findByIdAndUpdate(chatId,
                {
                    $pull:{users:userId}
                },{
                    new: true,
                })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                return removedUsers
        } catch (error) {
            next(error)
        }
    }

    async deleteGroupChat(chatId, userId){
        try {
            const admin = await chatSchema.findById(chatId)
            const adminId = admin.groupAdmin.toString().split("\"")[0]
            if (adminId !== userId){
                throw new ApiError.BadRequestError('You are not allowed to delete')
            }
            const groupChatDeleted = await chatSchema.findByIdAndDelete(chatId)
            const messagesDeleted = await messageSchema.deleteMany({chat:chatId})
            return {groupChatDeleted,messagesDeleted}
        } catch (error) {
            next(error)
        }
    }

    async deleteLocalChat(chatId, userId){
        try {
            const tryDeleteChat = await chatSchema.findById(chatId)
            const chatUserId = tryDeleteChat.users.map(users=> {return users.toString().split("\"")[0]})
            const isChatUser = chatUserId.indexOf(userId)
            if(isChatUser === -1) {
                res.status(400).json({message:'You are not allowed to delete'})
                return 
            }
            const localChatDeleted = await chatSchema.findByIdAndDelete(chatId)
            const messagesDeleted = await messageSchema.deleteMany({chat:chatId})
            return {localChatDeleted,messagesDeleted}
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ChatService()
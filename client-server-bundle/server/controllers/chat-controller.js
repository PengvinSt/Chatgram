const chatService = require('../service/chat-service.js');

class chatController {
    async accessChat(req,res,next){
        const {userId, loggedUserId} = req.body;
        try {
            const chatData = await chatService.accessChat(userId, loggedUserId)
            res.status(200).send(chatData)
        } catch (error) {
            next(error)
        }
    }
    async getUserChats(req,res,next){
        const {loggedUserId} = req.body;
        
        try {
            const data = await chatService.getUserChats(loggedUserId)
            
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async createGroupChat(req,res,next){
        const {users, name, loggedUserId} = req.body;
        const pic = ''
        try {
            const data = await chatService.createGroupChat(users, name, loggedUserId,pic)
            res.status(200).json(data)
        } catch (error) {
            next(error) 
        }
    }
    async changeGroupChat(req,res,next){
        const {chatId, chatName} = req.body
        let newPic;
        if (req.file){
            newPic = req.file.path
        }
        try {
            const data = await chatService.changeGroupChat(chatId, chatName, newPic)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async addToGroupChat(req,res,next){
        const {chatId, userId} = req.body
        try {
            const data = await chatService.addToGroupChat(chatId, userId)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async removeGroupChat(req,res,next){
        const {chatId, userId} = req.body
        try {
            const data = await chatService.removeGroupChat(chatId, userId)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async deleteGroupChat(req, res, next) {
        const {chatId, userId} = req.body
        try {
            const data = await chatService.deleteGroupChat(chatId, userId)
            res.status(200).json(data)     
        } catch (error) {
            next(error)
        }
    }
    async deleteLocalChat(req, res, next) {
        const {chatId, userId} = req.body
        try {
            const data = await chatService.deleteLocalChat(chatId, userId)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new chatController()
const messageService = require('../service/message-service.js');
const ApiError = require('../utils/apiError.js');

class messageController {
    async sendMessage(req,res,next){
        const {chatId, loggedUserId} = req.body
        // console.log(req.body)
        // console.log(req.file)
        let content 
        if(req.file){
            content = `http://localhost:5000/${req.file.path}`
            // console.log(req.file.path)    
        }else{
            
            if(req.body.content){
                content = req.body.content   
            }else{
                res.status(400).json({message:`Incorrect type of file(img/jpg/jpeg only)`}) 
                return
            }
            
        }
        // console.log(content)
        try {           
            const data = await messageService.sendMessage(content, chatId, loggedUserId)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async findChatMessages(req,res,next){
        const {chatId} = req.params
        try {
            const data = await messageService.findChatMessages(chatId)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new messageController()
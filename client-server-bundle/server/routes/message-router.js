const Router = require('express')
const controller = require('../controllers/message-controller.js')
const router = new Router()
const uploadMiddleware = require('../utils/uploadMiddleware.js')


router.post('/',uploadMiddleware.single('newPic'),controller.sendMessage)
router.get('/:chatId',controller.findChatMessages)
module.exports = router
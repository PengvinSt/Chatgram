const Router = require('express')
const controller = require('../controllers/chat-controller.js')
const router = new Router()
const uploadMiddleware = require('../utils/uploadMiddleware.js')


router.post('/',controller.accessChat)
router.post('/getchats',controller.getUserChats)
router.post('/group',controller.createGroupChat)
router.put('/change',uploadMiddleware.single('newPic'),controller.changeGroupChat) 
router.put('/groupadd',controller.addToGroupChat) 
router.put('/groupremove',controller.removeGroupChat) 
router.post('/groupremove',controller.deleteGroupChat) 
router.post('/localremove',controller.deleteLocalChat)
module.exports = router
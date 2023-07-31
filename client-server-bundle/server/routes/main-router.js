const Router = require('express')
const devRouter = require('./dev-router.js')
const userRouter = require('./user-router.js')
const chatRouter = require('./chat-router.js')
const messageRouter = require('./message-router.js')
const router = new Router()

router.use('/dev', devRouter)
router.use('/user', userRouter)
router.use('/chat', chatRouter)
router.use('/message', messageRouter)
module.exports = router
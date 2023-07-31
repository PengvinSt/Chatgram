const Router = require('express')
const controller = require('../controllers/dev-controller.js')
const router = new Router()

//Test endpoint
router.post('/', controller.devFun)

module.exports = router
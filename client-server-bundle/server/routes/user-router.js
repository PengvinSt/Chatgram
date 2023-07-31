const Router = require('express')
const controller = require('../controllers/user-controller.js')
const {body} = require('express-validator')
const router = new Router()
const uploadMiddleware = require('../utils/uploadMiddleware.js')

//name, email, password, pic

router.post('/register',
body('name').isLength({max:16, min:4}),
body('password').isLength({max:16, min:4}),
body('email').isEmail(),
controller.register)

router.post('/login', controller.login)
router.post('/logout', controller.logout) ///user/token
router.post('/token', controller.refreshToken)
router.get('/getusers', controller.getAllUsers)
router.post('/deleteuser', controller.deleteUser) //changeuserdata
router.post('/changeuserdata',uploadMiddleware.single('newPic'), controller.changeUserData) //changeuserdata
module.exports = router
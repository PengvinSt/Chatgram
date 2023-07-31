const {validationResult} = require('express-validator')
const ApiError = require('../utils/apiError.js');
const userService = require('../service/user-service.js');
const jwt = require('jsonwebtoken')

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}
const verifyToken = (token) =>{
    const verifyJwt = jwt.verify(token, process.env.JWT_SECRET)
    if(verifyJwt){
       return verifyJwt.id
    }
}

class userController {

    //name, email, password, pic
    async register(req, res, next){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){ 
                const err = errors.array()[0];
                console.log(err)
                throw ApiError.BadRequestError(`Registration failed: invalid ${err.path}`) 
            }
            const {name, email, password, pic} = req.body;
            const userData = await userService.registration(name, email, password, pic)
            const token = generateToken(userData._id);
            return res.status(200).json({user:userData, token})
        } catch (error) {
            next(error)
        }
    }
    async login(req, res,next){
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password)
            const token = generateToken(userData._id);
            return res.status(200).json({user:userData, token})
        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req, res,next){
        try {
            const { token } = req.body;
            const userId = verifyToken(token)
            const userData = await userService.refreshToken(userId)
            return res.status(200).json({user:userData})
        } catch (error) {
            next(error)
        }
    }
    async logout(req, res,next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async deleteUser(req, res,next){
        const {loggedUserId, isChatDelete} = req.body
        try {
            const data = await userService.deleteUser(loggedUserId, isChatDelete)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req, res,next){
        try {
            const keyword = req.query.search
            && { name: { $regex: req.query.search, $options: "i" } }
            const users = await userService.getAllUsers(keyword)
            return res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }
    async changeUserData(req, res, next) {
        const {newUsername, loggedUserId} = req.body
        let newPic;
        if (req.file){
            // console.log(req.file)
            newPic = req.file.path
        }
        try {
            const data = await userService.changeUserData(newUsername, loggedUserId, newPic)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new userController()
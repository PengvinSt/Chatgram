const userSchema = require('../models/userSchema.js')
const chatSchema = require('../models/chatSchema.js')
const messageSchema = require('../models/messageSchema.js')
const ApiError = require('../utils/apiError.js')
const UserClear = require('../utils/userClear.js');
const bcrypt = require('bcrypt')

class UserService {
    async registration(name, email, password, pic){
        const candidate = await userSchema.findOne({email})
        if (candidate){
            throw ApiError.BadRequestError(`User with ${email} email already exists`)
        }
        
        const hashPassword = await bcrypt.hash(password, 4)
        
        const user = await userSchema.create({name, email, password:hashPassword, pic})
        
        return user
    }
    async login(email, password){
        const user = await userSchema.findOne({email})
        if (!user){
            throw ApiError.BadRequestError(`User with ${email} is not exist`)
        }
        const verifyPassword = await bcrypt.compare(password,user.password)
        if (!verifyPassword){
            throw ApiError.BadRequestError(`Uncorrect password`)
        }
        return user
    }
    async getAllUsers(keyword){
        const users = await userSchema.find(keyword);
        return users
    }
    async refreshToken(userId){
        const user = await userSchema.find({_id:userId});
        return user
    }
    async deleteUser(loggedUserId, isChatDelete){
        const deleteUser = await userSchema.findByIdAndDelete(loggedUserId)
        if (isChatDelete){
            const deleteUserLocalChats = await chatSchema.deleteMany({ users:{$elemMatch:{$eq:loggedUserId}}, isGroupChat:false})
            const deleteUserGroupChat = await chatSchema.deleteMany({groupAdmin:loggedUserId, isGroupChat:true})
            return {deleteUser, deletedChats:[deleteUserLocalChats,deleteUserGroupChat]}
        }
        return {deleteUser}
    }
    async changeUserData(newUsername, loggedUserId, newPic){
        const changeTry = await userSchema.find({name:newUsername})
        if(changeTry.length > 0){
            throw ApiError.BadRequestError(`User with ${newUsername} name already exists`)
        }
        // console.log({newUsername, loggedUserId, newPic})
        if(newUsername.length !== 0){
            if(newPic !== undefined) {
                const changeCandidate = await userSchema.findByIdAndUpdate(loggedUserId, {
                    name:newUsername,
                    pic:`http://localhost:5000/${newPic}`
                })
                return {changeCandidate}
            }
            const changeCandidate = await userSchema.findByIdAndUpdate(loggedUserId, {
                name:newUsername,
            })
            return {changeCandidate}
        }else {
            if(newPic !== undefined) {
                const changeCandidate = await userSchema.findByIdAndUpdate(loggedUserId, {
                    pic:`http://localhost:5000/${newPic}`
                })
                return {changeCandidate}
            }else {
                throw ApiError.BadRequestError(`No data was changed!`)
            }
        }
    }
}
module.exports = new UserService()
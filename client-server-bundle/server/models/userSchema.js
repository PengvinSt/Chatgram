const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
    },
    isOnline:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true,
})

module.exports = model('User', userSchema)
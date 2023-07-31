const {Schema, model, default: mongoose} = require('mongoose')

const chatSchema = new Schema({
    chatName:{
        type:String,
        trim:true
        },
    isGroupChat:{
        type:Boolean,
         default:false
        },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" 
    },
    pic:{
        type:String,
    }
},{
    timestamps:true,
})

module.exports = model('Chat',chatSchema) 
let mongoose=require("mongoose")
let validator =require("validator")
const userRoles = require("../utils/userRoles.js")

const userSchema =new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"failed must be a valid email address"]
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    role:{
        type:String,
        enum:[userRoles.ADMIN,userRoles.USER,userRoles.MANAGER],
        default :userRoles.USER
    },
    avatar:{
        type:String,
        default:'uploads/profile.jpg'
    }
})
module.exports =mongoose.model("User",userSchema)
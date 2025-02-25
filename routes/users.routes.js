let express = require("express");
let userscontroller=require("../controller/users.controller.js")
let verifyToken=require("../middleware/verifyToken.js")
let AppError =require("../utils/error.js")
let router=express.Router()
const multer  = require('multer');
const { date } = require("joi");
const diskStorage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        const ext=file.mimetype.split("/")[1]
        const fileName=`user-${Date.now()}.${ext}`
        cb(null,fileName)
    }
})
const fileFilter =(req,file,cb)=>{
    const imagetype =file.mimetype.split("/")[0]
    if(imagetype=='image'){
        return cb(null,true)
    }else{
        return cb(AppError.creat('file must be image',400),false)
    }
}
const upload = multer({ storage:diskStorage,fileFilter })
router.use(express.json());
//get all users
//register
//login
router.route("/api/users")
            .get(verifyToken,userscontroller.getAllusers)
router.route("/api/users/register")
            .post(upload.single('avatar'),userscontroller.register)
router.route("/api/users/login")
            .post(userscontroller.login)
module.exports=router
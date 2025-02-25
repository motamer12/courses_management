const jwt =require("jsonwebtoken")
const httpStatus=require("../utils/httpstatus.js" )
const Apperror=require("../utils/error.js")

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader){
        const error=Apperror.creat("token is required",404,httpStatus.ERROR)
                return next(error)
    }
    const token =authHeader.split(' ')[1]
    try{
        const currentUser=jwt.verify(token,process.env.jwt_secret_key)
        req.currentUser=currentUser
        next()
    }catch(err){
        const error=Apperror.creat("invalid token",404,httpStatus.ERROR)
                return next(error)
    }    
    
}
module.exports=verifyToken
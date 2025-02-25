const AppError=require("../utils/error.js")
module.exports =(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            return next(AppError.creat("This role is not authorized",401))
        }
        next()
    }
}
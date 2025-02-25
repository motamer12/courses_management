const asyncWrapper=require("../middleware/asyncWrraper.js")
const User=require("../models/users.model.js")
const httpStatus=require("../utils/httpstatus.js" )
const Apperror=require("../utils/error.js")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const generateJWT = require("../utils/generateJWT.js")

const getAllusers=asyncWrapper( async (req, res,next) => {
    const query=req.query
    const limit=query.limit ||10;
    const page =query.page ||1;
    const skip=(page-1)*limit
    const users = await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip)
    res.json({ status: httpStatus.SUCCESS, data: { users } });
})


const register=asyncWrapper(async(req,res,next)=>{
    const {firstname,lastname,email,password,role}=req.body
    const oldUser=await User.findOne({email:email})
    if(oldUser){
        const error=Apperror.creat("user already exists",404,httpStatus.FAIL)
        return next(error)
    }
    //hashing password
    const hashedPassword=await bcrypt.hash(password,8)
    const newUser=new User({
        firstname,
        lastname,
        email,
        password:hashedPassword,
        role,
        avatar:req.file.filename
    })
    // generate jwt token
    const token =await generateJWT({email:newUser.email,id:newUser._id,role:newUser.role})
    newUser.token=token
    await newUser.save()
    res.status(201).json({ status:httpStatus.SUCCESS,data:{user:newUser}})
})


const login=asyncWrapper(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email && !password){
        const error=Apperror.creat("email and password are required",404,httpStatus.FAIL)
        return next(error)
    }
    const user =await User.findOne({email:email})
    if(!user){
        const error=Apperror.creat("user not found",404,httpStatus.FAIL)
        return next(error)
    }
    const matchedPassword=await bcrypt.compare(password,user.password)
    if (user && matchedPassword){
        //loged  in successfully
        const token =await generateJWT({email:user.email,id:user._id,role:user.role})
        return res.json({ status: httpStatus.SUCCESS, data: { token } });
    }else{
        const error=Apperror.creat("wrong password",500,httpStatus.ERROR)
        return next(error)
    }
})


module.exports={
    getAllusers,
    register,
    login
}
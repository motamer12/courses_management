let joi = require("joi");
let Course = require("../models/courses.model.js");
let asyncWrapper=require("../middleware/asyncWrraper.js")
let httpStatus = require("../utils/httpstatus.js");
let AppError=require("../utils/error.js")
const { STATES, Error } = require("mongoose");

// schema for joi middlewar
let schema = joi.object({
  title: joi.string().min(3).required(),
  price: joi.number().integer().min(1000).required(),
});


let getAllcourses =asyncWrapper( async (req, res,next) => {
  const query=req.query
  const limit=query.limit ||10;
  const page =query.page ||1;
  const skip=(page-1)*limit
  const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip)
  res.json({ status: httpStatus.SUCCESS, data: { courses } });
})


let getCourse =asyncWrapper(
  async(req,res,next)=>{
    const course = await Course.findById(req.params.courseId);
    if (!course) { 
      const error=AppError.creat("Not found course",404,httpStatus.FAIL)
      return next(error)
    }
    return res.json({ status: httpStatus.SUCCESS, data: { course } });
})


let addcourse =asyncWrapper( async (req, res ,next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    const error =AppError.creat(error.details[0].message,400,httpStatus.FAIL,)
    next(error)
  }
  const newcourse = new Course(req.body);
  await newcourse.save();
  res.json({ status:httpStatus.SUCCESS,data:{course:newcourse}});
})


let updatecourse =asyncWrapper( async (req, res, next) => {
  let courseId = req.params.courseId;
  const updatedcourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    const error=AppError.creat(error.details[0].message,400,httpStatus.FAIL)
    next(error)
  }
  res.status(200).json({ status:httpStatus.SUCCESS,data:{course:updatedcourse}});
})


let deletecourse =asyncWrapper( async (req, res, next) => {
  await Course.deleteOne({ _id: req.params.courseId });
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
})


module.exports = {
  getAllcourses,
  getCourse,
  addcourse,
  updatecourse,
  deletecourse,
  schema,
};

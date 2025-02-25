let express = require("express");
let coursescontroller=require("../controller/courses.controller.js");
const verifyToken = require("../middleware/verifyToken.js");
const userRoles = require("../utils/userRoles.js");
const allowedTo = require("../middleware/allowedTo.js");
let router=express.Router()
router.use(express.json());
router.route("/api/courses")
            .get(coursescontroller.getAllcourses)
            .post(coursescontroller.addcourse)
router.route("/api/courses/:courseId")
            .get(coursescontroller.getCourse)
            .patch(coursescontroller.updatecourse)
            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursescontroller.deletecourse)
module.exports=router
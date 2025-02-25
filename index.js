let express = require("express");
let cors =require("cors")
let httpStatus = require("./utils/httpstatus.js");
require("dotenv").config()
const mongoose = require("mongoose");
const path =require("path")
let asyncWrapper=require("./middleware/asyncWrraper.js")
let url =process.env.MONGO_URL
mongoose.connect(url).then(() => {
  console.log("connected succssefully");
});
let coursesrouter = require("./routes/courses.routes.js");
let usersrouter = require("./routes/users.routes.js");
let app = express();
app.use("/uploads",express.static(path.join(__dirname,'uploads')))
let port = process.env.PORT;
app.use(cors())
app.use(express.json());
app.use("/", coursesrouter);
app.use("/", usersrouter);
//global middlewar for routes
app.all("*",(req,res,next)=>{
    return res.status(404).json({status:httpStatus.ERROR,msg:"this route is not avaliable"})
})
//global middlewar error handler
app.use((error,req,res,next)=>{
    res.status(error.statusCode ||500).json({status:error.statustext || httpStatus.ERROR,message:error.message})
})
app.listen(port, () => console.log(`app run on ${port}`));

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_name: {type:String,required:true},
    description:{type:String},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})
const Course = mongoose.model("Course",courseSchema)
export default Course;
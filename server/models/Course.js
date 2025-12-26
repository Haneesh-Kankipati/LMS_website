import mongoose from "mongoose";
import Student from "./Student.js";
import feePayment from "./FeePayment.js";
import User from "./User.js";

const courseSchema = new mongoose.Schema({
    course_name: {type:String,required:true},
    description:{type:String},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})
courseSchema.pre("deleteOne",{document:true,query:false},async function (next) {
    try {
        const students=await Student.find({std_course:this._id})
        const stdIds=students.map(std=>std._id)
        const userIds=students.map(std=>std.user_id)
        await Student.deleteMany({std_course:this._id})
        await feePayment.deleteMany({student:{$in:stdIds}})
        await User.deleteMany({_id:{$in:userIds}})
        next()
    } catch (error) {
        next(error)
    }
})
const Course = mongoose.model("Course",courseSchema)
export default Course;
import mongoose from "mongoose";
import Course from "./Course";

const studentSchema = new mongoose.Schema({
    std_image:{type:Image,required:true},
    std_name:{type:String,required:true},
    parent_name:{type:String,required:true},
    ph_number:{type:String,required:true},
    std_dob:{type:Date,required:true},
    std_course:{type:Course,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})
const Student = mongoose.model("Student",studentSchema)
export default Student;
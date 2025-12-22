import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    std_id:{type:String,required:true,unique:true},
    std_name:{type:String,required:true},
    parent_name:{type:String,required:true},
    std_dob:{type:Date,required:true},
    std_course:{type:mongoose.Schema.Types.ObjectId,ref:"Course",required:true},
    std_gender:{type:String,required:true},
    fee_structure:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})
const Student = mongoose.model("Student",studentSchema)
export default Student;
import mongoose from "mongoose";
import User from "./User.js";
import feeStructure from "./FeeStructure.js";

const studentSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    std_id:{type:String,required:true,unique:true},
    std_name:{type:String,required:true},
    parent_name:{type:String,required:true},
    std_dob:{type:Date,required:true},
    std_course:{type:mongoose.Schema.Types.ObjectId,ref:"Course",required:true},
    std_gender:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})
studentSchema.pre("deleteOne",{document:true,query:false},async function (next) {
    try {
        // Find all fee structures for this student and call document.deleteOne()
        // so any FeeStructure pre-delete hooks run.
        const structures = await feeStructure.find({ student: this._id });
        for (const s of structures) {
            await s.deleteOne();
        }

        // Delete associated user
        await User.deleteOne({ _id: this.user_id });
        next()
    } catch (error) {
        next(error)
    }
})
const Student = mongoose.model("Student",studentSchema)
export default Student;
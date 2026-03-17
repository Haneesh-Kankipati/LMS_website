import mongoose from "mongoose";
import feePayment from "./FeePayment.js";

const feeStructureSchema = new mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true},
    year:{type:String,required:true},
    fee:{type:Number,required:true},
    discount:{type:Number,required:true},
    extra:{type:Number,required:true},
    total:{type:Number,required:true}
})

feeStructureSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
    try {
        // delete payments that reference this fee structure by calling document.deleteOne()
        const payments = await feePayment.find({ feeStructure: this._id });
        for (const p of payments) {
            await p.deleteOne();
        }
        next();
    } catch (error) {
        next(error);
    }
});
const feeStructure = mongoose.model("FeeStructure",feeStructureSchema)
export default feeStructure;
// Ensure a student can't have two structures for the same year
feeStructureSchema.index({ student: 1, year: 1 }, { unique: true });
import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true},
    fee:{type:Number,required:true},
    discount:{type:Number,required:true},
    extra:{type:Number,required:true},
    total:{type:Number,required:true},
    payDate:{type:Date,required:true}
})
const feePayment = mongoose.model("FeePayment",feePaymentSchema)
export default feePayment;
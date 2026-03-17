import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema({
    feeStructure:{type:mongoose.Schema.Types.ObjectId,ref:"FeeStructure",required:true},
    payDate:{type:Date,required:true},
    amountPaid:{type:Number,required:true}
})
const feePayment = mongoose.model("FeePayment",feePaymentSchema)
export default feePayment;
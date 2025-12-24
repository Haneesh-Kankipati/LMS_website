import FeePayment from "../models/FeePayment.js"
import Student from "../models/Student.js";

export const addPayment = async (req, res) => {
  try {
    const {
      course,
      student,
      fee,
      discount,
      extra,
      total,
      payDate
    } = req.body;

    // Validate required fields
    if (!student || fee == null || discount == null || extra == null || !payDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newPayment = new FeePayment({
      student,
      fee,
      discount,
      extra,
      total, // only if in schema
      payDate
    });

    await newPayment.save();
    return res.status(200).json({ success: true, feePayment: newPayment });
  } catch (error) {
    console.error("Error adding payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error adding payment",
    });
  }
};
export const getStudentPayments=async(req,res)=>{
  try {
    const{studentUserId}=req.params;
    const student = await Student.findOne({ user_id: studentUserId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Find all payments for that student
    const payments = await FeePayment.find({ student: student._id })
      .populate({
        path: "student",
        populate: {
          path: "std_course",
          select: "course_name"
        }
      })

      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    return res.status(500).json({success:false,message:"Server error getting payments"})
  }
}
export const getPayments=async(req,res)=>{
  try {
    const payments = await FeePayment.find()
  .populate({
    path: "student", // populate the student object
    populate: {
      path: "std_course", // inside student, populate the course
      select: "course_name" // only get course_name
    },
    select: "std_id std_name std_course" // get student fields
  });
      return res.status(200).json({success:true,payments})
  } catch (error) {
    return res.status(500).json({success:false,message:"Server error getting payments"})
  }
}

export const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await FeePayment.findById(paymentId)
  .populate({
    path: "student",
    populate: [
      { path: "std_course", select: "course_name" },
      { path: "user_id", select: "name email profileImage" }
    ],
    select: "std_id std_name std_course user_id"
  });


    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Error getting payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error getting payment"
    });
  }
};

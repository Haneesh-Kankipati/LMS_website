import FeePayment from "../models/FeePayment.js"
import Student from "../models/Student.js";
import FeeStructure from "../models/FeeStructure.js";

export const addPayment = async (req, res) => {
  try {
    const { feeStructure, payDate, amountPaid } = req.body;

    // Validate required fields
    if (!feeStructure || !payDate || amountPaid == null) {
      return res.status(400).json({ success: false, message: "feeStructure, payDate and amountPaid are required" });
    }

    // Ensure feeStructure exists
    const fsDoc = await FeeStructure.findById(feeStructure);
    if (!fsDoc) {
      return res.status(404).json({ success: false, message: "FeeStructure not found" });
    }

    const newPayment = new FeePayment({
      feeStructure,
      payDate,
      amountPaid,
    });

    await newPayment.save();
    return res.status(200).json({ success: true, feePayment: newPayment });
  } catch (error) {
    console.error("Error adding payment:", error.message);
    return res.status(500).json({ success: false, message: "Server error adding payment" });
  }
};
export const getPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required" });
    }

    // Find student by std_id
    const student = await Student.findOne({ std_id: studentId });
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    // Get all fee structures for this student
    const structures = await FeeStructure.find({ student: student._id });
    const structureIds = structures.map((s) => s._id);

    // Get all payments for these structures
    const payments = await FeePayment.find({ feeStructure: { $in: structureIds } })
      .populate({
        path: "feeStructure",
        populate: [
          { path: "student", populate: { path: "user_id", select: "name email profileImage" } },
          { path: "student", populate: { path: "std_course", select: "course_name" } }
        ]
      })
      .sort({ payDate: -1 });

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error getting payments by student:", error.message);
    return res.status(500).json({ success: false, message: "Server error getting payments by student" });
  }
};


export const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await FeePayment.findById(paymentId)
      .populate({
        path: "feeStructure",
        populate: [
          { path: "student", populate: { path: "user_id", select: "name email profileImage" } },
          { path: "student", populate: { path: "std_course", select: "course_name" } }
        ]
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Error getting payment:", error.message);
    return res.status(500).json({ success: false, message: "Server error getting payment" });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await FeePayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    await payment.deleteOne();

    return res.status(200).json({ success: true, deletedPayment: payment });
  } catch (error) {
    console.error("Error deleting payment:", error.message);
    return res.status(500).json({ success: false, error: "delete payment server error" });
  }
};

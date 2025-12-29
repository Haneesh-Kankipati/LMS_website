import Student from "../models/Student.js";
import Course from "../models/Course.js";
import feePayment from "../models/FeePayment.js";
export const getData = async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const courses = await Course.countDocuments();

    const earningsResult = await feePayment.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$total" }
        }
      }
    ]);

    const earnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    const data = {
      students,
      courses,
      earnings
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "dashboard get data error" });
  }
};
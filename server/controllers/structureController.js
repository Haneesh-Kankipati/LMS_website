import FeeStructure from "../models/FeeStructure.js";
import Student from "../models/Student.js";

export const addStructure = async (req, res) => {
    try {
        const { student, year, fee, discount, extra, total } = req.body;

        // Basic validation
        if (!student || year == null || fee == null) {
            return res.status(400).json({ success: false, error: "student, year and fee are required" });
        }

        // Ensure student exists
        const foundStudent = await Student.findById(student);
        if (!foundStudent) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }

        // Compute total if not provided
        const computedTotal = total != null ? total : (Number(fee) - Number(discount || 0) + Number(extra || 0));

        // Ensure uniqueness: a student should not have two structures for the same year
        const existing = await FeeStructure.findOne({ student, year });
        if (existing) {
            return res.status(400).json({ success: false, error: "Fee structure for this student and year already exists" });
        }

        const newStructure = new FeeStructure({
            student,
            year,
            fee,
            discount: discount || 0,
            extra: extra || 0,
            total: computedTotal,
        });

        await newStructure.save();

        return res.status(201).json({ success: true, feeStructure: newStructure });
    } catch (error) {
        console.error("addStructure error:", error.message);
        // Handle duplicate key just in case the DB index triggers
        if (error && error.code === 11000) {
            return res.status(400).json({ success: false, error: "Fee structure for this student and year already exists" });
        }
        return res.status(500).json({ success: false, error: "Server error adding fee structure" });
    }
};
export const getStucturesByStudent = async (req,res)=>{
    try {
        const { std_id } = req.params;

        if (!std_id) {
            return res.status(400).json({ success: false, error: "std_id param is required" });
        }

        const student = await Student.findOne({ std_id });
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }

        const structures = await FeeStructure.find({ student: student._id })
            .populate({
                path: 'student',
                select: 'std_name parent_name std_email std_phone std_id std_course',
                populate: {
                    path: 'std_course',
                    select: 'course_name'
                }
            })
            .sort({ year: -1 });

        return res.status(200).json({ success: true, structures });
    } catch (error) {
        console.error("getStucturesByStudent error:", error.message);
        return res.status(500).json({ success: false, error: "Server error fetching fee structures" });
    }
}

export const deleteStructure=async(req,res)=>{
    try {
        const { structureId } = req.params;

        if (!structureId) {
            return res.status(400).json({ success: false, error: "Structure id is required" });
        }

        const structure = await FeeStructure.findById(structureId);

        if (!structure) {
            return res.status(404).json({ success: false, error: "Fee structure not found" });
        }

        await structure.deleteOne();

        return res.status(200).json({ success: true, deleted: structure });
    } catch (error) {
        console.error("deleteStructure error:", error.message);
        return res.status(500).json({ success: false, error: "Server error deleting fee structure" });
    }
}
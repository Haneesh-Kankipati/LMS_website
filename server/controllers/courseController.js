import Course from "../models/Course.js";
const getCourse=async(req,res)=>{
    try {
        const{id}= req.params;
        const course= await Course.findById({_id:id})
        return res.status(200).json({success:true,course})
    } catch (error) {
        return res.status(500).json({success:false,error:"get course server error"})
    }
}
const getCourses = async(req,res)=>{
    try {
        const courses= await Course.find()
        return res.status(200).json({success:true,courses})
    } catch (error) {
        return res.status(500).json({success:false,error:"get courses server error"})
    }
}

const addCourse= async (req,res) =>{
    try {
        const {course_name, description}=req.body;
        const newCourse = new Course({
            course_name,
            description
        })
        await newCourse.save()
        return res.status(200).json({success:true,course:newCourse})
    } catch (error) {
        return res.status(500).json({success:false,error:"add course server error"})
    }
}

const updateCourse =async(req,res)=>{
    try {
        const{id}=req.params;
        const {course_name,description}=req.body;
        const updateCourse = await Course.findByIdAndUpdate({_id:id},{
            course_name,
            description
        })
        return res.status(200).json({success:true,updateCourse})
    } catch (error) {
        return res.status(500).json({success:false,error:"edit course server error"})
    }
}
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ success: false, error: "Course not found" });
        }
        return res.status(200).json({ success: true, deletedCourse });
    } catch (error) {
        return res.status(500).json({ success: false, error: "delete course server error" });
    }
};
export {addCourse,getCourses,getCourse,updateCourse,deleteCourse}
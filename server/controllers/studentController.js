import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../routes/cloudinary.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import bcrypt from "bcrypt"
import mongoose from "mongoose";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lms_profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const addStudent= async(req,res)=>{
    let savedUser;
    try {
        const{
        std_name,
        parent_name,
        std_id,
        ph_number,
        std_dob,
        std_gender,
        std_course,
        std_password,
    } = req.body;
    
    const existingStudent = await Student.findOne({ std_id });
    if (existingStudent) {
        return res.status(400).json({ success: false, error: "Student ID already exists" });
    }

    const user= await User.findOne({email:ph_number})
    if(user){
        return res.status(400).json({success:false,error:`User already exists ${user.email}`});
    }
    
    const hashPassword = await bcrypt.hash(std_password,10)
    const newUser= new User({
        name:std_name,
        email:ph_number,
        password:hashPassword,
        role:"student",
        profileImage:req.file? req.file.path:""
    })
    const savedUser=await newUser.save()

    const newStudent= new Student({
        user_id:savedUser._id,
        std_id,
        std_name,
        parent_name,
        std_dob,
        std_course,
        std_gender
    })

    await newStudent.save()
    return res.status(200).json({success:true,message:"student created"})
        
    } catch (error) {
    console.error("ADD STUDENT ERROR 🔥", error);

    if (savedUser) {
        await User.findByIdAndDelete(savedUser._id);
    }

    return res.status(500).json({
        success: false,
        error: error.message // 👈 SEND REAL ERROR
    });
}

    
}
const getStudents=async(req,res)=>{
    try {
        const students= await Student.find().populate('user_id',{password:0}).populate('std_course')
        return res.status(200).json({success:true,students})
    } catch (error) {
        return res.status(500).json({success:false,error:"get students server error"})
    }
}
const getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    let student = await Student.findOne({ std_id: id })
      .populate("user_id", { password: 0 })
      .populate("std_course");

    if (!student) {
      student = await Student.findOne({ user_id: id })
        .populate("user_id", { password: 0 })
        .populate("std_course");
    }

    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      student: {
        ...student._doc,
        profileImage: student.user_id?.profileImage || null,
      },
      user: student.user_id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "get student server error" });
  }
};


const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            std_name,
            parent_name,
            std_id,
            ph_number,
            std_dob,
            std_gender,
            std_course,
            std_password
        } = req.body;

        // Check if student exists
        const student = await Student.findOne({std_id:id});
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }

        // Check if std_id is being changed to an existing one
        if (std_id && std_id !== student.std_id) {
            const existingStudent = await Student.findOne({ std_id });
            if (existingStudent) {
                return res.status(400).json({ success: false, error: "Student ID already exists" });
            }
        }

        // Check if ph_number is being changed to an existing user's email
        if (ph_number) {
            const existingUser = await User.findOne({ email: ph_number });
            if (existingUser && existingUser._id.toString() !== student.user_id.toString()) {
                return res.status(400).json({ success: false, error: "Phone number already in use" });
            }
        }

        const userUpdate = {
            name: std_name,
            email: ph_number
        };
        
        // If a new image is uploaded, delete the old one from Cloudinary
        if (req.file && req.file.path) {
            // Get the existing user to find the old image
            const existingUser = await User.findById(student.user_id);
            if (existingUser?.profileImage) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = existingUser.profileImage.split('/');
                    const publicId = `lms_profiles/${urlParts[urlParts.length - 1].split('.')[0]}`;
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Failed to delete old profile image from Cloudinary:", err);
                }
            }
            userUpdate.profileImage = req.file.path;
        }

        // If password is provided, hash and update it
        if (std_password && std_password.trim() !== "") {
            const hashPassword = await bcrypt.hash(std_password, 10);
            userUpdate.password = hashPassword;
        }

        // Update User (for name, ph_number, and password if provided)
        await User.findByIdAndUpdate(student.user_id, userUpdate);


        // Update Student
        const updatedStudent = await Student.findOneAndUpdate(
            {std_id:id},
            {
                std_name,
                parent_name,
                std_id,
                ph_number,
                std_dob,
                std_gender,
                std_course
            },
            { new: true }
        );

        return res.status(200).json({ success: true, student: updatedStudent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "edit student server error" });
    }
};
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find student
    const student = await Student.findOne({ std_id: id });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    // Find associated user
    const user = await User.findById(student.user_id);

    // Delete profile image from Cloudinary if exists
    if (user?.profileImage) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = user.profileImage.split('/');
        const publicId = `lms_profiles/${urlParts[urlParts.length - 1].split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete profile image from Cloudinary:", err);
      }
    }

    // Delete student
    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Student and profile image deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "delete student server error",
    });
  }
};

const getStudentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await Student.findOne({ user_id: userId })
      .populate("user_id", { password: 0 })
      .populate("std_course")
      .populate("std_id")
      .populate("parent_name");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      student: {
        ...student._doc,
        profileImage: student.user_id?.profileImage || null,
      },
      user: student.user_id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "get student by user id server error" });
  }
};

const importStudentsFromExcel = async (req, res) => {
  try {
    const { students: studentsData } = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No student data provided" 
      });
    }

    let added = 0;
    let skipped = 0;
    const errors = [];

    for (const studentData of studentsData) {
      try {
        const {
          std_id,
          course,
          name,
          dob,
          gender,
          parent_name,
          phone_number
        } = studentData;

        // Validate required fields
        if (!std_id || !name || !phone_number) {
          skipped++;
          errors.push(`Row skipped: Missing required fields (std_id, name, or phone_number)`);
          continue;
        }

        // Check if student ID already exists
        const existingStudent = await Student.findOne({ std_id });
        if (existingStudent) {
          skipped++;
          errors.push(`Student ID ${std_id} already exists`);
          continue;
        }

        // Check if phone number (used as email) already exists
        const existingUser = await User.findOne({ email: phone_number });
        if (existingUser) {
          skipped++;
          errors.push(`Phone number ${phone_number} already exists`);
          continue;
        }

        // Find course by name
        let courseId = null;
        if (course && course.trim()) {
          const courseObj = await Course.findOne({ course_name: course });
          if (courseObj) {
            courseId = courseObj._id;
          }
        }

        // Hash the password (phone number)
        const hashPassword = await bcrypt.hash(phone_number, 10);

        // Create new user
        const newUser = new User({
          name,
          email: phone_number,
          password: hashPassword,
          role: "student",
          profileImage: ""
        });

        const savedUser = await newUser.save();

        // Parse date of birth
        let parsedDob = null;
        if (dob) {
          // Handle different date formats
          if (typeof dob === 'number') {
            // Excel date format (serial number)
            const date = new Date((dob - 25569) * 86400 * 1000);
            parsedDob = date;
          } else if (typeof dob === 'string') {
            parsedDob = new Date(dob);
          }
        }

        // Create new student
        const newStudent = new Student({
          user_id: savedUser._id,
          std_id,
          std_name: name,
          parent_name: parent_name || "",
          std_dob: parsedDob,
          std_course: courseId,
          std_gender: gender || ""
        });

        await newStudent.save();
        added++;

      } catch (error) {
        skipped++;
        errors.push(`Row error: ${error.message}`);
        console.error("Import error for student:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Import completed. Added: ${added}, Skipped: ${skipped}`,
      added,
      skipped,
      errors: errors.slice(0, 10) // Return first 10 errors
    });

  } catch (error) {
    console.error("IMPORT STUDENTS ERROR 🔥", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export {addStudent,upload,getStudents,getStudent,updateStudent,deleteStudent,getStudentByUserId,importStudentsFromExcel}
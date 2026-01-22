import multer from "multer";
import Student from "../models/Student.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import path from "path";
import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({storage:storage})

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
        profileImage:req.file? req.file.filename:""
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
        if (req.file && req.file.filename) {
            userUpdate.profileImage = req.file.filename;
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

    // Delete profile image if exists
    if (user?.profileImage) {
      // uploaded files are stored in server/public/uploads and only filename is saved
      const imagePath = path.join(__dirname, "..", "public", "uploads", user.profileImage);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error("Failed to delete profile image:", err);
        }
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
export {addStudent,upload,getStudents,getStudent,updateStudent,deleteStudent}
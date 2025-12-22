import multer from "multer";
import Student from "../models/Student.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import path from "path";
import mongoose from "mongoose";

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
    try {
        const{
        std_name,
        parent_name,
        std_id,
        ph_number,
        std_dob,
        std_gender,
        std_course,
        fee_structure,
        std_password,
    } = req.body;
    
    const existingStudent = await Student.findOne({ std_id });
    if (existingStudent) {
        return res.status(400).json({ success: false, error: "Student ID already exists" });
    }

    const user= await User.findOne({email:ph_number})
    if(user){
        return res.status(400).json({success:false,error:"User already exists"});
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
        std_gender,
        fee_structure,
        std_password
    })

    await newStudent.save()
    return res.status(200).json({success:true,message:"student created"})
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Server error adding student"})
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
        const student = await Student.findOne({std_id:id})
            .populate('user_id', { password: 0 })
            .populate('std_course');
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        return res.status(200).json({ success: true, student,user:student.user_id});
    } catch (error) {
        return res.status(500).json({ success: false, error: "get student server error" });
    }
}
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
            fee_structure,
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
                std_course,
                fee_structure
            },
            { new: true }
        );

        return res.status(200).json({ success: true, student: updatedStudent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "edit student server error" });
    }
};
const deleteStudent=async(req,res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({ success: false, error: "delete student server error" });
    }
}
export {addStudent,upload,getStudents,getStudent,updateStudent,deleteStudent}
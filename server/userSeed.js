import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectToDatabase from "./db/db.js";

dotenv.config();

const userRegister = async () => {
  try {
    await connectToDatabase();
    console.log("✅ Connected to database");

    const hashPassword = await bcrypt.hash("admin", 10);

    const existing = await User.findOne({ email: "admin@gmail.com" });

    if (!existing) {
      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashPassword,
        role: "admin",
      });

      console.log("✅ Admin user created");
    } else {
      console.log("⚠️ Admin already exists");
    }

    // ✅ CLOSE CONNECTION
    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.log("❌ Error:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

userRegister();
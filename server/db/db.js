import mongoose from "mongoose";

const connectToDatabase = async ()=>{
    try {
        console.log("Connecting to database");
        await mongoose.connect(process.env.MONGODB_URL)
        
    } catch (error) {
        console.log(error)
    }
}
export default connectToDatabase

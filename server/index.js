import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"
import courseRouter from "./routes/course.js"
import studentRouter from "./routes/student.js"
import feePaymentRouter from "./routes/feePayment.js"
import settingsRouter from "./routes/settings.js"
import dashboardRouter from "./routes/dashboard.js"
import galleryRouter from "./routes/gallery.js"
import dotenv from "dotenv"
import connectToDatabase from './db/db.js'
import path from "path";
import { fileURLToPath } from "url";
dotenv.config()
connectToDatabase()


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/gallery", express.static(path.join(__dirname, "public/gallery")));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/api/auth',authRouter)
app.use('/api/course',courseRouter)
app.use('/api/student',studentRouter)
app.use('/api/feepayment',feePaymentRouter)
app.use('/api/settings',settingsRouter)
app.use('/api/dashboard',dashboardRouter)
app.use('/api/gallery',galleryRouter)
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

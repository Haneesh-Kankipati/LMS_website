import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"
import courseRouter from "./routes/course.js"
import studentRouter from "./routes/student.js"
import feePaymentRouter from "./routes/feePayment.js"
import settingsRouter from "./routes/settings.js"
import dashboardRouter from "./routes/dashboard.js"
import dotenv from "dotenv"
import connectToDatabase from './db/db.js'
dotenv.config()
connectToDatabase()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRouter)
app.use('/api/course',courseRouter)
app.use('/api/student',studentRouter)
app.use('/uploads', express.static('public/uploads'));
app.use('/api/feepayment',feePaymentRouter)
app.use('/api/settings',settingsRouter)
app.use('/api/dashboard',dashboardRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

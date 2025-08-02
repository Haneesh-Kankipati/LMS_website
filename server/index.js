import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"
import courseRouter from "./routes/course.js"
import dotenv from "dotenv"
import connectToDatabase from './db/db.js'
dotenv.config()
connectToDatabase()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRouter)
app.use('/api/course',courseRouter)



app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

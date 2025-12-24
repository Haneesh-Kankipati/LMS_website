import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addPayment ,getPayments,getPayment,getStudentPayments} from "../controllers/paymentController.js"

const router = express.Router()
router.get('/',authMiddleware,getPayments)
router.get('/:studentUserId',authMiddleware,getStudentPayments)
router.get('/payment/:paymentId',authMiddleware,getPayment)
router.post('/add',authMiddleware,addPayment)
export default router
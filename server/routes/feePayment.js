import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addPayment ,getPayment,getPaymentsByStudent,deletePayment} from "../controllers/paymentController.js"

const router = express.Router()
router.get('/payment/:paymentId', authMiddleware, getPayment);
router.delete('/payment/:paymentId', authMiddleware, deletePayment);

router.get('/:studentId', authMiddleware, getPaymentsByStudent);
router.post('/add', authMiddleware, addPayment);

export default router
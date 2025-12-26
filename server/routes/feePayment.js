import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addPayment ,getPayments,getPayment,getStudentPayments,deletePayment} from "../controllers/paymentController.js"

const router = express.Router()
router.get('/payment/:paymentId', authMiddleware, getPayment);
router.delete('/payment/:paymentId', authMiddleware, deletePayment);

router.get('/:studentUserId', authMiddleware, getStudentPayments);
router.get('/', authMiddleware, getPayments);
router.post('/add', authMiddleware, addPayment);

export default router
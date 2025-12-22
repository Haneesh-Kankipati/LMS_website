import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addPayment ,getPayments,getPayment} from "../controllers/paymentController.js"

const router = express.Router()
router.get('/',authMiddleware,getPayments)
router.get('/:paymentId',authMiddleware,getPayment)
router.post('/add',authMiddleware,addPayment)
export default router
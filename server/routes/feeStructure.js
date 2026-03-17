import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {addStructure, deleteStructure, getStucturesByStudent} from "../controllers/structureController.js"
const router = express.Router()
router.post('/add', authMiddleware, addStructure);
router.get('/:std_id',authMiddleware,getStucturesByStudent)
router.delete('/:structureId',authMiddleware,deleteStructure)
export default router
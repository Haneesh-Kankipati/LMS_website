import express from 'express';
import {
  getAllStudents,
  addStudent,
  updateStudent
} from '../controllers/students.js';
import { verifyToken, checkRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, checkRole(['admin']), getAllStudents);
router.post('/', verifyToken, checkRole(['admin']), addStudent);
router.put('/:id', verifyToken, checkRole(['admin']), updateStudent);

export default router;

import express from 'express';
import { loginStudent, loginAdmin, registerStudent } from '../controllers/auth.js';

const router = express.Router();

router.post('/student/login', loginStudent);
router.post('/admin/login', loginAdmin);
router.post('/student/register', registerStudent);

export default router;

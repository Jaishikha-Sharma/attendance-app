import express from 'express';
import { punchIn , punchOut , getMonthlyAttendanceSummary  , getTodayStatus , getUserPunchHistory } from '../controllers/attendanceController.js'; 
import protect  from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/summary', protect, getMonthlyAttendanceSummary);
router.get('/status', protect, getTodayStatus);
router.get('/my-history', protect, getUserPunchHistory);


export default router;

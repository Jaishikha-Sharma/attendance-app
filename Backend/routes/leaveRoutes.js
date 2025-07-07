import express from 'express';
import { applyLeave ,getHRSummary  } from '../controllers/leaveController.js';
import protect  from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/hr-summary', protect, getHRSummary);

export default router;

import express from 'express';
import {
  createFreelancer,
  getFreelancers
} from '../controllers/freelancerController.js';
import  protect  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createFreelancer);
router.get('/all', protect, getFreelancers);

export default router;

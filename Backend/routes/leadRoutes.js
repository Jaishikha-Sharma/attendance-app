import express from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead
} from '../controllers/leadController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-lead', protect, createLead);
router.get('/get-all', protect, getAllLeads);
router.get('/:id', protect, getLeadById);

router.put('/update-lead/:id', protect, updateLead);

export default router;

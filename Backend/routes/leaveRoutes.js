import express from "express";
import {
  applyLeave,
  getHRSummary,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/hr-summary", protect, getHRSummary);
router.get('/all', protect, getAllLeaves);
router.put('/status/:id', protect, updateLeaveStatus);

export default router;

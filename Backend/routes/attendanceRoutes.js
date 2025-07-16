import express from "express";
import {
  punchIn,
  punchOut,
  getMonthlyAttendanceSummary,
  getTodayStatus,
  getUserPunchHistory,
  requestManualPunchIn,
  getManualPunchRequests,
  approveManualPunchRequest,
  rejectManualPunchRequest
} from "../controllers/attendanceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/punch-in", protect, punchIn);
router.post("/punch-out", protect, punchOut);
router.get("/summary", protect, getMonthlyAttendanceSummary);
router.get("/status", protect, getTodayStatus);
router.get("/my-history", protect, getUserPunchHistory);
router.post("/request-punch-in", protect, requestManualPunchIn);
router.get("/manual-requests", protect, getManualPunchRequests);
router.put("/manual-requests/:id/approve", protect, approveManualPunchRequest);
router.put("/manual-requests/:id/reject", protect, rejectManualPunchRequest);

export default router;

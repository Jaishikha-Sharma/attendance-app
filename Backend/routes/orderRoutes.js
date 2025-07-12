import express from "express";
import {
  createOrder,
  getProjectCoordinators,
  getCoordinatorOrders,
  assignVendorToOrder,
  updateDueAmount,
  updateInstitution,
  getVendorOrders
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/project-coordinators", getProjectCoordinators);
router.get("/my-orders", protect, getCoordinatorOrders);
router.patch("/:id/assign-vendor", protect, assignVendorToOrder);
router.patch("/:id/update-due", protect, updateDueAmount);
router.put("/orders/:id/institution", updateInstitution);
router.get("/my-vendor-orders", protect, getVendorOrders);

export default router;

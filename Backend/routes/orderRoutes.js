import express from "express";
import {
  createOrder,
  getProjectCoordinators,
  getCoordinatorOrders,
  assignVendorsToOrder,
  updateDueAmount,
  updateInstitution,
  getVendorOrders,
  updateVendorGroupLink,
  updateDeliveryStatus,
  updateCustomerGroupLink,
  updateVendorPrice
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/project-coordinators", getProjectCoordinators);
router.get("/my-orders", protect, getCoordinatorOrders);
router.patch("/:id/assign-vendor", protect, assignVendorsToOrder);
router.patch("/:id/update-due", protect, updateDueAmount);
router.put("/orders/:id/institution", updateInstitution);
router.get("/my-vendor-orders", protect, getVendorOrders);
router.put("/update-vendor-group/:id", protect, updateVendorGroupLink);
router.patch("/:id/update-status", protect, updateDeliveryStatus);
router.put("/customer-group-link/:id", protect, updateCustomerGroupLink);
router.patch("/:id/update-vendor-price", protect, updateVendorPrice);

export default router;

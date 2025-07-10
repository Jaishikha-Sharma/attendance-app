import express from "express";
import { createOrder  , getProjectCoordinators , getCoordinatorOrders} from "../controllers/orderController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/project-coordinators", getProjectCoordinators);
router.get("/my-orders", protect, getCoordinatorOrders);

export default router;

import express from "express";
import { createOrder  , getProjectCoordinators} from "../controllers/orderController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/project-coordinators", getProjectCoordinators);

export default router;

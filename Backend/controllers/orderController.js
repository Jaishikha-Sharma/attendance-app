import Order from "../models/Order.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getProjectCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({
      role: "Project Coordinator",
    }).select("_id name email");
    res.status(200).json(coordinators);
  } catch (error) {
    console.error("Failed to fetch project coordinators:", error);
    res.status(500).json({ error: "Failed to fetch project coordinators" });
  }
};

export const getCoordinatorOrders = async (req, res) => {
  try {
    const coordinatorId = req.user._id;
    const orders = await Order.find({ projectCoordinator: coordinatorId }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

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
export const assignVendorToOrder = async (req, res) => {
  try {
    const { vendor } = req.body; // vendor will be a name or ID
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.vendor = vendor; // Just updating vendor field
    await order.save();

    res.status(200).json({ message: "Vendor assigned successfully", order });
  } catch (error) {
    console.error("Error assigning vendor:", error);
    res.status(500).json({ message: "Failed to assign vendor" });
  }
};
export const updateDueAmount = async (req, res) => {
  try {
    const { dueAmount, paymentMode, paymentDate } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.dueAmount = dueAmount;
    order.duePaymentMode = paymentMode;
    order.duePaymentDate = paymentDate;

    await order.save();

    res.status(200).json({ message: "Due amount updated successfully", order });
  } catch (error) {
    console.error("Error updating due amount:", error);
    res.status(500).json({ message: "Failed to update due amount" });
  }
};
export const updateInstitution = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { institution } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.institution = institution;
    await order.save();

    res.status(200).json({ message: "Institution updated successfully", order });
  } catch (error) {
    console.error("Error updating institution:", error);
    res.status(500).json({ message: "Failed to update institution" });
  }
};

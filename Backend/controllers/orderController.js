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
export const assignVendorsToOrder = async (req, res) => {
  try {
    const { vendors } = req.body; // 🆕 array of vendor names (strings)
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.vendors = vendors; // 🆕 assign array
    await order.save();

    res.status(200).json({ message: "Vendors assigned successfully", order });
  } catch (error) {
    console.error("Error assigning vendors:", error);
    res.status(500).json({ message: "Failed to assign vendors" });
  }
};

export const updateDueAmount = async (req, res) => {
  try {
    let { paidAmount, paymentMode, paymentDate } = req.body;
    const orderId = req.params.id;

    paidAmount = Number(paidAmount);

    if (isNaN(paidAmount)) {
      return res.status(400).json({ message: "Invalid paid amount" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedDue = order.dueAmount - paidAmount;

    if (updatedDue < 0) {
      return res
        .status(400)
        .json({ message: "Paid amount exceeds due amount" });
    }

    order.dueAmount = updatedDue;
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

    res
      .status(200)
      .json({ message: "Institution updated successfully", order });
  } catch (error) {
    console.error("Error updating institution:", error);
    res.status(500).json({ message: "Failed to update institution" });
  }
};
export const getVendorOrders = async (req, res) => {
  try {
    const freelancerName = req.user.name; // logged-in vendor's name

    // 🆕 Match freelancerName inside vendors array
    const orders = await Order.find({ vendors: freelancerName })
      .sort({ createdAt: -1 })
      .populate("assignedBy", "name")
      .populate("projectCoordinator", "name");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ error: "Failed to fetch vendor orders" });
  }
};

export const updateVendorGroupLink = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { vendorGroupLink } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.vendorGroupLink = vendorGroupLink;
    await order.save();

    res.status(200).json({ message: "Vendor group link updated", order });
  } catch (error) {
    console.error("Error updating vendor group link:", error);
    res.status(500).json({ message: "Failed to update vendor group link" });
  }
};
export const updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { deliveryStatus } = req.body;

    if (
      !["Delivered", "UnDelivered", "Pending", "In-Transit"].includes(
        deliveryStatus
      )
    ) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.status(200).json({ message: "Delivery status updated", order });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};
export const updateCustomerGroupLink = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerGroupLink } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.customerGroupLink = customerGroupLink;
    await order.save();

    res.status(200).json({ message: "Customer group link updated", order });
  } catch (error) {
    console.error("Error updating customer group link:", error);
    res.status(500).json({ message: "Failed to update customer group link" });
  }
};
export const updateVendorPrice = async (req, res) => {
  try {
    const { vendorName, price } = req.body;
    const orderId = req.params.id;

    if (!vendorName || typeof price !== "number") {
      return res
        .status(400)
        .json({ message: "Vendor name and valid price are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.vendors.includes(vendorName)) {
      return res
        .status(400)
        .json({ message: "Vendor is not assigned to this order" });
    }

    // ✅ Fix: Initialize vendorPrices if undefined
    if (!order.vendorPrices || typeof order.vendorPrices !== "object") {
      order.vendorPrices = {};
    }

    order.vendorPrices[vendorName] = price;

    await order.save();

    res.status(200).json({ message: "Vendor price updated", order });
  } catch (error) {
    console.error("Error updating vendor price:", error);
    res.status(500).json({ message: "Failed to update vendor price" });
  }
};


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderDate: Date,
    customerName: String,
    customerEmail: String,
    customerAddress: String,
    contact: String,
    country: String,
    state: String,
    notes: String,
    leadSource: String,
    customerType: String,
    deadline: Date,

    projectType: String,
    topic: String,
    purpose: String,
    institution: String,

    sellingPrice: Number,
    advanceAmount: Number,
    deliveryStatus: {
      type: String,
      enum: ["UnDelivered", "Delivered", "Pending"],
      default: "Pending",
    },

    vendor: {
      type: String,
      default: "",
    },

    orderNo: {
      type: String,
      unique: true,
    },

    advanceMode: String,
    projectCoordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    dueAmount: {
      type: Number,
      default: 0,
    },
    duePaymentMode: {
      type: String,
      default: "",
    },
    duePaymentDate: {
      type: Date,
    },

    vendorAmount: {
      type: Number,
      default: 0,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chatApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceGeneratedOn: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    customerFeedback: {
      type: String,
      default: "",
    },
    remarksByManagement: {
      type: String,
      default: "",
    },
    vendorGroupLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  // ✅ Safe unique order number
  if (this.isNew && !this.orderNo && this.projectCoordinator) {
    const User = mongoose.model("User");
    const coordinator = await User.findById(this.projectCoordinator);

    if (coordinator && coordinator.name) {
      const prefix = coordinator.name.slice(0, 3).toUpperCase();
      this.orderNo = `${prefix}${Date.now()}`; // ✅ Always unique
    }
  }

  // 💰 Auto-calculate due amount for new orders
  if (this.isNew) {
    const selling = this.sellingPrice || 0;
    const advance = this.advanceAmount || 0;
    this.dueAmount = Math.max(selling - advance, 0);
  }

  next();
});

export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
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
  advanceMode: String,
   projectCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);

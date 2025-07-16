import mongoose from "mongoose";

const manualPunchRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedDate: { type: String, required: true }, // e.g., "2025-07-16"
  requestedTime: { type: String, required: true }, // e.g., "10:30"
  reason: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const ManualPunchRequest = mongoose.model(
  "ManualPunchRequest",
  manualPunchRequestSchema
);

export default ManualPunchRequest;

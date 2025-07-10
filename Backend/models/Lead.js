import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadNo: String, // Auto generated: #PBL2114
    leadDate: Date, // Auto set on creation
    customerName: String,
    customerContact: String,
    customerEmail: String,
    city: String,
    state: String,
    servicesRequired: String,
    dueDate: Date,
    description: String,
    addedTime: String,
    actionedBy: String,
    leadSource: String,
    leadStatus: String,
    contactedViaCall: String,
    quotationStatus: String,
    leadResponse: String,
    enquiryStatus: String,
    orderDate: Date,
    orderValue: String,
    quotation: String,
    response: {
      type: String,
      enum: [
        "Pricing Issues",
        "Time Issues",
        "Distance Issues",
        "Payment Pending",
        "Details Awaited",
        "Project Cancelled",
        "Junk Lead",
        "Other Reasons",
        "Order Placed",
      ],
      required: true,
    },
    enquiry: String,
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);

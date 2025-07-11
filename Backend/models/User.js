import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "Admin",
      "Co-Admin",
      "Employee",
      "Freelancer",
      "HR",
      "Project Coordinator",
    ],
    required: true,
  },
  department: {
    type: String,
    enum: [
      "Project Coordinator",
      "Sales",
      "HR",
      "Finance",
      "Marketing",
      "IT",
      "Operations",
      "Other",
    ],
  },
  attendanceCriteria: { type: String },
  isOnLeave: { type: Boolean, default: false },
  contactNo: { type: String },
  state: { type: String },
  joiningDate: { type: Date },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  dob: { type: Date },
  address: { type: String },
  stream: { type: String },
  course: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  specialized: { type: String },
  alternateContact: { type: String },
  activityTime: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;

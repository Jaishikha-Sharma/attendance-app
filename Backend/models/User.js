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
      "Project Coordination/Management",
      "Sales",
      "HR",
      "Finance",
      "Marketing",
      "IT",
      "Operations",
      "Others",
    ],
  },
  attendanceCriteria: { type: String },
  isOnLeave: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;

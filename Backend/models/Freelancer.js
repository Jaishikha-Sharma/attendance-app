import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNo: { type: String },
  state: { type: String }, 
  department: { type: String }, 
  role: { type: String, default: "Freelancer" }, 
  joiningDate: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  dob: { type: Date },
  address: { type: String },
  stream: { type: String },
  course: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, {
  timestamps: true, 
});

export default mongoose.model('Freelancer', freelancerSchema);

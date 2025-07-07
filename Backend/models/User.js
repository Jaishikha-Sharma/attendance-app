import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'Co-Admin', 'Employee', 'Freelancer' , 'HR'],
    required: true
  },
  department: { type: String },
  attendanceCriteria: { type: String } ,
  isOnLeave: { type: Boolean, default: false }

});

const User = mongoose.model('User', userSchema);
export default User;

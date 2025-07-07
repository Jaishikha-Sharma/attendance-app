import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },      
  punchInTime: { type: Date },
  punchOutTime: { type: Date },
  autoPunchIn: { type: Boolean, default: false }, 
  status: { type: String, default: 'Present' },   
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

// Cron job
import autoPunchInJob from './cronJobs/autoPunchIn.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://attendance-app-tau-one.vercel.app'
];

// ✅ CORS middleware (works with credentials: true)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests from tools like Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);

// MongoDB + server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected!!');

    autoPunchInJob.start();
    console.log('⏰ Auto Punch-In cron job started');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

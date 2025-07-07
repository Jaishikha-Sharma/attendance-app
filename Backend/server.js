import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import autoPunchInJob from './cronJobs/autoPunchIn.js';
import freelancerCheckJob from './cronJobs/freelancerCheck.js';
import leaveRoutes from './routes/leaveRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/leave', leaveRoutes)


// Connect to MongoDB and Start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!!");
     autoPunchInJob.start();
      freelancerCheckJob.start();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Mongo Error:", err));

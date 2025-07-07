const isProduction = window.location.hostname !== "localhost";

const BASE_URL = isProduction
  ? "https://your-attendance-backend.onrender.com"  // 🔁 Replace with your actual Render URL
  : "http://localhost:5000";

export const AUTH_API = `${BASE_URL}/api/auth`;
export const ATTENDANCE_API = `${BASE_URL}/api/attendance`;
export const LEAVE_API = `${BASE_URL}/api/leave`;

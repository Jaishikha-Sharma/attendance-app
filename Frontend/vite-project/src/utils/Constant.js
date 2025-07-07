const LOCAL_API = 'http://localhost:5000/api';
const PROD_API = 'https://attendance-app-wtil.onrender.com/api';

export const BASE_URL = import.meta.env.MODE === 'development' ? LOCAL_API : PROD_API;

export const AUTH_API = `${BASE_URL}/auth`;
export const ATTENDANCE_API = `${BASE_URL}/attendance`;
export const LEAVE_API = `${BASE_URL}/leave`;

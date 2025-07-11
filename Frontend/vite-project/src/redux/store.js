// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import hrReducer from "./hrSlice";
import leaveReducer from "./leaveSlice";
import leadReducer from "./leadSlice";
import orderReducer from "./orderSlice";
import freelanceAttendanceReducer from "./freelanceAttendanceSlice";
import freelancerReducer from "./freelancerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hr: hrReducer,
    leave: leaveReducer,
    lead: leadReducer,
    order: orderReducer,
    freelancerAttendance: freelanceAttendanceReducer,
    freelancers: freelancerReducer,
  },
});

export default store;

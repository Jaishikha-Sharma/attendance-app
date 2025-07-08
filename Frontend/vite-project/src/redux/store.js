// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import hrReducer from "./hrSlice";
import leaveReducer from "./leaveSlice";
import leadReducer from "./leadSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hr: hrReducer,
    leave: leaveReducer,
    lead: leadReducer,
  },
});

export default store;

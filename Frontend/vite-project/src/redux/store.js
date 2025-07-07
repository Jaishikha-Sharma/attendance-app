// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import hrReducer from "./hrSlice";
import leaveReducer from "./leaveSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    hr: hrReducer,
    leave: leaveReducer,
  },
});

export default store;

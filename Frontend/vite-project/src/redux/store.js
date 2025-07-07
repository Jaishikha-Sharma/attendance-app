// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import hrReducer from './hrSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
     hr: hrReducer,
  },
});

export default store;

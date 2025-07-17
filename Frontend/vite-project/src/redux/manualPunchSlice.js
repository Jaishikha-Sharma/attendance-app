// redux/manualPunchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";

// ✅ Fetch all manual punch requests (token from state)
export const fetchManualPunchRequests = createAsyncThunk(
  "manualPunch/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      const res = await axios.get(`${ATTENDANCE_API}/manual-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.requests;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// ✅ Approve request
export const approvePunchRequest = createAsyncThunk(
  "manualPunch/approve",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      const res = await axios.put(`${ATTENDANCE_API}/manual-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.updatedRequest;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  }
);

// ✅ Reject request
export const rejectPunchRequest = createAsyncThunk(
  "manualPunch/reject",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      const res = await axios.put(`${ATTENDANCE_API}/manual-requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.updatedRequest;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Rejection failed");
    }
  }
);

const manualPunchSlice = createSlice({
  name: "manualPunch",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManualPunchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManualPunchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchManualPunchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approvePunchRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((r) => r._id !== action.payload._id);
      })
      .addCase(rejectPunchRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((r) => r._id !== action.payload._id);
      });
  },
});

export default manualPunchSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";

// ✅ User submits manual punch-in request
export const submitManualPunchRequest = createAsyncThunk(
  "manualPunch/submit",
  async (
    { requestedDate, requestedTime, reason, token },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${ATTENDANCE_API}/request-punch-in`,
        { requestedDate, requestedTime, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

// ✅ HR/Admin fetch all manual punch-in requests
export const fetchManualPunchRequests = createAsyncThunk(
  "manualPunch/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ATTENDANCE_API}/manual-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.requests;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// ✅ HR/Admin approves a request
export const approveManualPunchRequest = createAsyncThunk(
  "manualPunch/approve",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${ATTENDANCE_API}/manual-requests/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  }
);
// ❌ HR/Admin rejects a request
export const rejectManualPunchRequest = createAsyncThunk(
  "manualPunch/reject",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${ATTENDANCE_API}/manual-requests/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Rejection failed");
    }
  }
);

const manualPunchSlice = createSlice({
  name: "manualPunch",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
    requests: [], // for HR/Admin
  },
  reducers: {
    clearManualPunchMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📨 Submit Manual Punch
      .addCase(submitManualPunchRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitManualPunchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitManualPunchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch All Requests
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

      // ✅ Approve Request
      .addCase(approveManualPunchRequest.fulfilled, (state, action) => {
        state.successMessage = "Manual punch-in approved";
        const approvedId = action.meta.arg.id;
        const req = state.requests.find((r) => r._id === approvedId);
        if (req) req.status = "Approved";
      })
      .addCase(approveManualPunchRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // ❌ Reject Request
      .addCase(rejectManualPunchRequest.fulfilled, (state, action) => {
        state.successMessage = "Manual punch-in rejected";
        const rejectedId = action.meta.arg.id;
        const req = state.requests.find((r) => r._id === rejectedId);
        if (req) req.status = "Rejected";
      })
      .addCase(rejectManualPunchRequest.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearManualPunchMessages } = manualPunchSlice.actions;
export default manualPunchSlice.reducer;

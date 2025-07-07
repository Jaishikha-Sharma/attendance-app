import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LEAVE_API } from "../utils/Constant";

// 🔄 Fetch all leave requests (HR/Admin)
export const fetchAllLeaves = createAsyncThunk(
  "leave/fetchAllLeaves",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${LEAVE_API}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch leaves"
      );
    }
  }
);

// ✅ Approve or reject a leave
export const updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${LEAVE_API}/status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { id, status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// 📝 Employee applies for leave
export const applyLeave = createAsyncThunk(
  "leave/applyLeave",
  async ({ date, reason, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${LEAVE_API}/apply`,
        { date, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to apply for leave"
      );
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearLeaveMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch All Leaves
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Update Leave Status
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const leave = state.leaves.find((l) => l._id === id);
        if (leave) leave.status = status;
        state.successMessage = `Leave ${status.toLowerCase()} successfully`;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 📝 Apply Leave
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLeaveMessages } = leaveSlice.actions;
export default leaveSlice.reducer;

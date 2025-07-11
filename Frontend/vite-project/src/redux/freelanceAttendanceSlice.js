// redux/freelanceAttendanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";

// 🟢 Thunk: Get Today's Status
export const fetchFreelancerStatus = createAsyncThunk(
  "freelancer/fetchStatus",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ATTENDANCE_API}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching status");
    }
  }
);

// 🟢 Thunk: Punch In
export const punchInFreelancer = createAsyncThunk(
  "freelancer/punchIn",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${ATTENDANCE_API}/punch-in`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Punch in failed");
    }
  }
);

// 🟢 Thunk: Punch Out
export const punchOutFreelancer = createAsyncThunk(
  "freelancer/punchOut",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${ATTENDANCE_API}/punch-out`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Punch out failed");
    }
  }
);

const freelanceAttendanceSlice = createSlice({
  name: "freelancerAttendance",
  initialState: {
    loading: false,
    isPunchedIn: false,
    punchInTime: null,
    message: "",
    error: "",
  },
  reducers: {
    clearFreelanceMessage: (state) => {
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreelancerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFreelancerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isPunchedIn = action.payload.punchedIn;
        state.punchInTime = action.payload.punchInTime;
      })
      .addCase(fetchFreelancerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(punchInFreelancer.fulfilled, (state, action) => {
        state.isPunchedIn = true;
        state.punchInTime = new Date().toISOString();
        state.message = action.payload.message;
      })
      .addCase(punchInFreelancer.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(punchOutFreelancer.fulfilled, (state, action) => {
        state.isPunchedIn = false;
        state.punchInTime = null;
        state.message = action.payload.message;
      })
      .addCase(punchOutFreelancer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFreelanceMessage } = freelanceAttendanceSlice.actions;
export default freelanceAttendanceSlice.reducer;

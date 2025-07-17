import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FREELANCER_API } from "../utils/Constant";

// -------------------- Async Thunks -------------------- //

// Fetch all freelancers
export const fetchFreelancers = createAsyncThunk(
  "freelancers/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${FREELANCER_API}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch freelancers"
      );
    }
  }
);

// Create a new freelancer
export const createFreelancer = createAsyncThunk(
  "freelancers/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${FREELANCER_API}/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.freelancer;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create freelancer"
      );
    }
  }
);

// Update freelancer's actionables (status, activityTime, aadhar, pan, tags)
export const updateFreelancerActionables = createAsyncThunk(
  "freelancers/updateActionables",
  async ({ id, payload, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${FREELANCER_API}/${id}/actionables`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.updated;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update actionables"
      );
    }
  }
);

// -------------------- Slice -------------------- //

const freelancerSlice = createSlice({
  name: "freelancers",
  initialState: {
    list: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearFreelancerMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch freelancers
      .addCase(fetchFreelancers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFreelancers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFreelancers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create freelancer
      .addCase(createFreelancer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Freelancer created successfully";
        state.list.unshift(action.payload); // add at the top
      })
      .addCase(createFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update actionables
      .addCase(updateFreelancerActionables.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFreelancerActionables.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Freelancer updated successfully";

        const index = state.list.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateFreelancerActionables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFreelancerMessages } = freelancerSlice.actions;
export default freelancerSlice.reducer;

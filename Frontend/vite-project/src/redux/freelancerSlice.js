// redux/freelancerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FREELANCER_API } from "../utils/Constant"; 

// API call to get all freelancers
export const fetchFreelancers = createAsyncThunk(
  "freelancers/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
    const res = await axios.get(`${FREELANCER_API}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch freelancers");
    }
  }
);

const freelancerSlice = createSlice({
  name: "freelancers",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default freelancerSlice.reducer;

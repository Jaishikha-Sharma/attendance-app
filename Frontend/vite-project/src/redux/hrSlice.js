import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LEAVE_API } from '../utils/Constant'; 

// ✅ Async thunk to fetch HR summary data
export const fetchHRSummary = createAsyncThunk(
  'hr/fetchSummary',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LEAVE_API}/hr-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch HR summary'
      );
    }
  }
);

// ✅ Slice definition
const hrSlice = createSlice({
  name: 'hr',
  initialState: {
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHRSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchHRSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hrSlice.reducer;

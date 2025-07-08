import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LEAD_API } from "../utils/Constant";

export const fetchLeads = createAsyncThunk("lead/fetchLeads", async (token) => {
  const res = await axios.get(`${LEAD_API}/get-all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchLeadById = createAsyncThunk("lead/fetchLeadById", async ({ id, token }) => {
  const res = await axios.get(`${LEAD_API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    leads: [],
    selectedLead: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.selectedLead = action.payload;
      });
  },
});

export const { clearSelectedLead } = leadSlice.actions;
export default leadSlice.reducer;

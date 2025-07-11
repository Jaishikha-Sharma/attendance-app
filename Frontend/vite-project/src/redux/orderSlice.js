import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ORDER_API } from "../utils/Constant";

// 🔄 Thunk to create a new order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(`${ORDER_API}/create`, orderData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Order creation failed");
    }
  }
);
// ✏️ Assign vendor to order
export const assignVendor = createAsyncThunk(
  "order/assignVendor",
  async ({ orderId, vendorName }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/assign-vendor`,
        { vendor: vendorName },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Vendor assignment failed");
    }
  }
);
export const updateDueAmount = createAsyncThunk(
  "order/updateDueAmount",
  async (
    { orderId, dueAmount, paymentMode, paymentDate },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState();
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/update-due`,
        { dueAmount, paymentMode, paymentDate },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update due amount"
      );
    }
  }
);

// 📥 Thunk to fetch all orders assigned to the coordinator
export const fetchCoordinatorOrders = createAsyncThunk(
  "order/fetchCoordinatorOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${ORDER_API}/my-orders`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch orders");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    success: false,
    order: null,
    orders: [], // 🔁 List of all assigned orders for coordinator
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.order = null;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Create Order Cases
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch Assigned Orders
      .addCase(fetchCoordinatorOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoordinatorOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCoordinatorOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✏️ Assign vendor to order
      .addCase(assignVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update vendor inside orders list
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(assignVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDueAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDueAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateDueAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;

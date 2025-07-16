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
    { orderId, paidAmount, paymentMode, paymentDate },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState();
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/update-due`,
        { paidAmount, paymentMode, paymentDate }, // ✅ fix here
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

export const updateInstitution = createAsyncThunk(
  "order/updateInstitution",
  async ({ orderId, institution }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.put(
        `${ORDER_API}/orders/${orderId}/institution`,
        { institution },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update institution"
      );
    }
  }
);
// 🧾 Thunk to fetch vendor-assigned orders
export const fetchVendorOrders = createAsyncThunk(
  "order/fetchVendorOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${ORDER_API}/my-vendor-orders`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch vendor orders"
      );
    }
  }
);
export const updateVendorGroupLink = createAsyncThunk(
  "order/updateVendorGroupLink",
  async ({ orderId, vendorGroupLink }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.put(
        `${ORDER_API}/update-vendor-group/${orderId}`,
        { vendorGroupLink },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update vendor group link"
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
export const updateDeliveryStatus = createAsyncThunk(
  "order/updateDeliveryStatus",
  async ({ orderId, deliveryStatus }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/update-status`,
        { deliveryStatus },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update delivery status"
      );
    }
  }
);
export const updateCustomerGroupLink = createAsyncThunk(
  "order/updateCustomerGroupLink",
  async ({ orderId, customerGroupLink }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.put(
        `${ORDER_API}/customer-group-link/${orderId}`,
        { customerGroupLink },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update customer group link"
      );
    }
  }
);
// 💰 Update vendor price thunk
export const updateVendorPrice = createAsyncThunk(
  "order/updateVendorPrice",
  async ({ orderId, vendorAmount }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.patch(
        `${ORDER_API}/${orderId}/update-vendor-price`,
        { vendorAmount },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return res.data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update vendor price"
      );
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
    orders: [],
    vendorOrders: [],
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
      })
      .addCase(updateInstitution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateInstitution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.vendorOrders = action.payload;
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVendorGroupLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorGroupLink.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateVendorGroupLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔄 Update delivery status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomerGroupLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerGroupLink.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateCustomerGroupLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 💰 Update vendor price
      .addCase(updateVendorPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateVendorPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;

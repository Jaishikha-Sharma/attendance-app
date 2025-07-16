import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateVendorPrice } from "../redux/orderSlice";

const VendorPriceTable = ({ order }) => {
  const dispatch = useDispatch();
  const [vendorPrice, setVendorPrice] = useState("");

  // Set initial price when component mounts or order changes
  useEffect(() => {
    if (order?.vendorAmount) {
      setVendorPrice(order.vendorAmount.toString());
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorPrice || isNaN(vendorPrice)) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const action = await dispatch(
        updateVendorPrice({
          orderId: order._id,
          vendorAmount: Number(vendorPrice),
        })
      );

      const updatedOrder = action.payload?.order;

      if (updatedOrder?.vendorAmount) {
        setVendorPrice(updatedOrder.vendorAmount.toString()); // ✅ update input with new price
      }

      alert("Vendor price updated successfully");
    } catch (error) {
      console.error("Error updating vendor price:", error);
      alert("Failed to update price");
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
          Vendor Pricing Details
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-left">Vendor Name</th>
                <th className="border px-4 py-2 text-left">Enter Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-50 transition">
                <td className="border px-4 py-2 font-medium">
                  {order.vendor || "Not Assigned"}
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={vendorPrice}
                    onChange={(e) => setVendorPrice(e.target.value)}
                    placeholder="e.g. 1000"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="inline-block px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
          >
            Save Price
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorPriceTable;

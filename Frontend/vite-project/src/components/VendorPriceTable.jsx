import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateVendorPrice } from "../redux/orderSlice";

const VendorPriceTable = ({ order }) => {
  const dispatch = useDispatch();

  // Maintain a price per vendor
  const [vendorPrices, setVendorPrices] = useState({});

  // Set initial prices when order changes
  useEffect(() => {
    if (order?.vendors?.length) {
      const initialPrices = {};
      order.vendors.forEach((vendor) => {
        initialPrices[vendor] = order.vendorAmount || "";
      });
      setVendorPrices(initialPrices);
    }
  }, [order]);

  const handleChange = (vendorName, value) => {
    setVendorPrices((prev) => ({
      ...prev,
      [vendorName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Loop through all vendors if you support per-vendor pricing
    for (const vendorName of order.vendors || []) {
      const price = vendorPrices[vendorName];
      if (!price || isNaN(price)) {
        alert(`Invalid price for ${vendorName}`);
        return;
      }

      try {
        const action = await dispatch(
          updateVendorPrice({
            orderId: order._id,
            vendorAmount: Number(price), // adjust if you later allow per-vendor prices
          })
        );

        if (action.payload?.order?.vendorAmount) {
          setVendorPrices((prev) => ({
            ...prev,
            [vendorName]: action.payload.order.vendorAmount.toString(),
          }));
        }
      } catch (error) {
        console.error("Error updating vendor price:", error);
        alert(`Failed to update price for ${vendorName}`);
      }
    }

    alert("Vendor prices updated successfully");
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
              {(order.vendors || []).map((vendor) => (
                <tr
                  key={vendor}
                  className="bg-white hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-2 font-medium">{vendor}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={vendorPrices[vendor] || ""}
                      onChange={(e) =>
                        handleChange(vendor, e.target.value)
                      }
                      placeholder="e.g. 1000"
                      className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                </tr>
              ))}
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

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateVendorPrice } from "../redux/orderSlice";

const VendorPriceTable = ({ order, setSelectedOrder }) => {
  const dispatch = useDispatch();
  const [vendorPrices, setVendorPrices] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧠 Initialize vendorPrices state from order.vendorPrices
  useEffect(() => {
    if (order?.vendors?.length) {
      const initialPrices = {};
      order.vendors.forEach((vendor) => {
        initialPrices[vendor] = order.vendorPrices?.[vendor] ?? "";
      });
      setVendorPrices(initialPrices);
    }
  }, [order]);

  // Handle input change
  const handleChange = (vendorName, value) => {
    setVendorPrices((prev) => ({
      ...prev,
      [vendorName]: value,
    }));
  };

  // Save all vendor prices one by one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    for (const vendorName of order.vendors || []) {
      const price = vendorPrices[vendorName];
      if (price === "" || isNaN(price)) {
        alert(`❌ Invalid price for ${vendorName}`);
        setIsSubmitting(false);
        return;
      }

      try {
        const action = await dispatch(
          updateVendorPrice({
            orderId: order._id,
            vendorName,
            price: Number(price),
          })
        );

        if (action.meta.requestStatus !== "fulfilled") {
          alert(`❌ Failed to update price for ${vendorName}`);
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Error updating vendor price:", error);
        alert(`❌ Error updating price for ${vendorName}`);
        setIsSubmitting(false);
        return;
      }
    }

    // ✅ Final update to selectedOrder in parent
    setSelectedOrder((prev) => ({
      ...prev,
      vendorPrices: {
        ...prev.vendorPrices,
        ...vendorPrices,
      },
    }));

    alert("✅ Vendor prices updated successfully");
    setIsSubmitting(false);
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
                      value={vendorPrices[vendor] ?? ""}
                      onChange={(e) => handleChange(vendor, e.target.value)}
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
            disabled={isSubmitting}
            className="inline-block px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Price"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorPriceTable;

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

  const handleChange = (vendorName, value) => {
    setVendorPrices((prev) => ({
      ...prev,
      [vendorName]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const updates = order.vendors.map((vendorName) => {
    const price = vendorPrices[vendorName];
    if (price === "" || isNaN(price)) {
      return Promise.reject(`Invalid price for ${vendorName}`);
    }

    return dispatch(
      updateVendorPrice({
        orderId: order._id,
        vendorName,
        price: Number(price),
      })
    ).then((action) => {
      if (action.meta.requestStatus !== "fulfilled") {
        throw new Error(`Failed to update price for ${vendorName}`);
      }
    });
  });

  try {
    await Promise.all(updates);

    setSelectedOrder((prev) => ({
      ...prev,
      vendorPrices: {
        ...prev.vendorPrices,
        ...vendorPrices,
      },
    }));

    alert("✅ Vendor prices updated successfully");
  } catch (error) {
    alert(error.message || "❌ Error updating vendor prices");
  } finally {
    setIsSubmitting(false);
  }
};


  // ✅ Total price calculation
  const totalPrice = Object.values(vendorPrices).reduce(
    (acc, val) => acc + (parseFloat(val) || 0),
    0
  );

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
              <tr className="bg-gray-100 font-semibold">
                <td className="border px-4 py-2 text-right">Total</td>
                <td className="border px-4 py-2">₹ {totalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 italic mt-1">
          Note: Delivery charges excluded from the above prices.
        </p>

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

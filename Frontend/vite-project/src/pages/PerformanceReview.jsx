import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";

// Colors for the pie slices: Delivered, In-Transit, Undelivered
const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const PerformanceReview = ({ activeTab, role }) => {
  const orders = useSelector((state) => state.order.orders);
  const [statusSummary, setStatusSummary] = useState([]);

  useEffect(() => {
    if (
      activeTab === "dashboard" &&
      role === "Project Coordinator" &&
      Array.isArray(orders) &&
      orders.length > 0
    ) {
      const summary = [
        {
          name: "Delivered",
          value: orders.filter(
            (o) => o.deliveryStatus?.toLowerCase() === "delivered"
          ).length,
        },
        {
          name: "In-Transit",
          value: orders.filter(
            (o) => o.deliveryStatus?.toLowerCase() === "in-transit"
          ).length,
        },
        {
          name: "Undelivered",
          value: orders.filter(
            (o) =>
              o.deliveryStatus?.toLowerCase() !== "delivered" &&
              o.deliveryStatus?.toLowerCase() !== "in-transit"
          ).length,
        },
      ];

      // Only show statuses with at least 1 order
      setStatusSummary(summary.filter((item) => item.value > 0));
    }
  }, [activeTab, role, orders]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-12">
      <h3 className="text-lg font-bold mb-4">Performance Review</h3>

      {statusSummary.length === 0 ? (
        <p className="text-gray-500">No performance data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusSummary}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {statusSummary.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PerformanceReview;

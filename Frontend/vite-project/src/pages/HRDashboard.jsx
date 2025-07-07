// src/pages/HRDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHRSummary } from "../redux/hrSlice";
import { Users, BedDouble, CheckCircle2, MailWarning } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ✅ Card UI Component
const StatCard = ({ title, value, Icon, color }) => (
  <div
    className={`bg-white p-5 rounded-2xl shadow-xl border-l-4 ${color} hover:scale-[1.02] transition-transform duration-300`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-full">
        <Icon className="w-7 h-7 text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  </div>
);

// 🎨 Pie Chart Colors
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#a3d3f1",
  "#f59e0b",
];

const HRDashboard = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.hr);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHRSummary(token));
  }, [dispatch, token]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        👩‍💼 HR Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-gray-600 animate-pulse">
          Loading summary...
        </div>
      ) : summary ? (
        <>
          {/* 🔢 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Employees"
              value={summary.totalEmployees}
              Icon={Users}
              color="border-indigo-500"
            />
            <StatCard
              title="On Leave Today"
              value={summary.onLeave}
              Icon={BedDouble}
              color="border-yellow-400"
            />
            <StatCard
              title="Present Today"
              value={summary.presentToday}
              Icon={CheckCircle2}
              color="border-green-500"
            />
            <StatCard
              title="Pending Leaves"
              value={summary.pendingLeaves}
              Icon={MailWarning}
              color="border-red-500"
            />
          </div>

          {/* 📊 Charts Section */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            📊 Attendance Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bar Chart: Daily Attendance */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-bold mb-2">Daily Attendance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summary.dailyAttendance}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart: Leave Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-bold mb-2">Leave Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={summary.leaveTrends}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="leaves"
                    stroke="#facc15"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Department Split */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-bold mb-2">Department Split</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={summary.deptData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {summary.deptData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">
          No summary data available.
        </div>
      )}
    </div>
  );
};

export default HRDashboard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHRSummary } from "../redux/hrSlice";
import {
  Users,
  BedDouble,
  CheckCircle2,
  MailWarning,
  LogIn,
  LogOut,
  UserCheck,
  Clock,
  Menu,
} from "lucide-react";
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
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";
import ManualApproval from "../components/ManualApproval";
import FreelancerTable from "../components/FreelancerTable";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#a3d3f1",
  "#f59e0b",
];

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

const HRDashboard = () => {
  const dispatch = useDispatch();
  const { summary, loading, error, successMessage } = useSelector(
    (state) => state.hr
  );
  const { user, token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [timer, setTimer] = useState("00:00:00");
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchHRSummary(token));
  }, [dispatch, token]);
  // Restore timer from localStorage if page reloads
  useEffect(() => {
    const localPunchedIn = localStorage.getItem("isPunchedIn") === "true";
    const localPunchInTime = localStorage.getItem("punchInTime");

    if (localPunchedIn && localPunchInTime) {
      setIsPunchedIn(true);
      setPunchInTime(new Date(localPunchInTime));
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${ATTENDANCE_API}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.punchedIn) {
          const punchTime = new Date(res.data.punchInTime);
          setIsPunchedIn(true);
          setPunchInTime(punchTime);
          localStorage.setItem("isPunchedIn", "true");
          localStorage.setItem("punchInTime", punchTime.toISOString());
        } else {
          setIsPunchedIn(false);
          setPunchInTime(null);
          localStorage.removeItem("isPunchedIn");
          localStorage.removeItem("punchInTime");
        }
      } catch (err) {
        console.log("Punch Status Error:", err);
      }
    };
    fetchStatus();
  }, [token]);

  useEffect(() => {
    let interval;
    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - punchInTime) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = async () => {
    try {
      const res = await axios.post(
        `${ATTENDANCE_API}/punch-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const now = new Date();
      setMessage(res.data.message);
      setIsPunchedIn(true);
      setPunchInTime(now);
      localStorage.setItem("isPunchedIn", "true");
      localStorage.setItem("punchInTime", now.toISOString());
    } catch (err) {
      setMessage(err.response?.data?.message || "Error punching in");
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await axios.post(
        `${ATTENDANCE_API}/punch-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setIsPunchedIn(false);
      setPunchInTime(null);
      setTimer("00:00:00");
      localStorage.removeItem("isPunchedIn");
      localStorage.removeItem("punchInTime");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error punching out");
    }
  };

  const isPunchAllowedNow = () => {
    const now = new Date();
    const role = user?.role;

    if (role === "Admin") return false;
    if (role === "Freelancer") return now.getDay() === 0;

    if (role === "Project Coordinator") {
      const hour = now.getHours();
      return hour >= 9 && hour < 15;
    }

    if (["Employee", "Co-Admin", "HR"].includes(role)) {
      const hour = now.getHours();
      const minute = now.getMinutes();
      return hour === 11 && minute <= 30;
    }

    return true;
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      {/* Sidebar */}
      <div
        className={`sm:block w-full sm:min-h-screen shadow-lg bg-indigo-700 text-white p-6 space-y-6 transition-all duration-300 ease-in-out ${
          collapsed ? "sm:w-20" : "sm:w-64"
        } ${showSidebar ? "" : "hidden"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <UserCheck className="w-6 h-6" />
            {!collapsed && <span>{user?.name}</span>}
          </div>

          {/* Collapse Toggle */}
          <button
            className="text-white hover:text-indigo-300 sm:inline-block hidden"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 010-1.414L12.586 11H4a1 1 0 110-2h8.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 5.293a1 1 0 010 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {!collapsed && (
          <p className="text-sm text-indigo-200">Role: {user?.role}</p>
        )}
        <hr className="border-indigo-500" />

        {/* Navigation */}
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-indigo-900"
                : "hover:bg-indigo-600"
            }`}
          >
            <UserCheck className="w-5 h-5" />
            {!collapsed && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveTab("manual-approvals")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              activeTab === "manual-approvals"
                ? "bg-indigo-900"
                : "hover:bg-indigo-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            {!collapsed && <span>Manual Approvals</span>}
          </button>
          <button
            onClick={() => setActiveTab("freelancers")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              activeTab === "freelancers"
                ? "bg-indigo-900 text-white"
                : "hover:bg-indigo-600 text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            {!collapsed && <span>Freelancers</span>}
          </button>
        </nav>
      </div>

      {/* Toggle Sidebar */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded-full shadow-md"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main */}
      <div className="flex-1 p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          HR Dashboard
        </h1>

        {/* Role-based Info */}
        <div className="mb-4">
          {activeTab === "dashboard" && (
            <div className="mb-4">
              {user?.role === "Admin" ? (
                <div className="text-red-500 font-semibold">
                  Admin does not need to punch in/out.
                </div>
              ) : user?.role === "Freelancer" && new Date().getDay() !== 0 ? (
                <div className="text-yellow-600 font-semibold">
                  Freelancers can punch in manually only on Sundays.
                </div>
              ) : user?.role === "Project Coordinator" ? (
                <div className="text-blue-600 font-semibold">
                  Project Coordinators punch in between 9AM–3PM, punch out after
                  9PM.
                </div>
              ) : (
                <div className="text-green-700 font-semibold">
                  Regular timing: Punch in between 11:00AM–11:30AM. Auto after
                  that.
                </div>
              )}
            </div>
          )}
        </div>
        {activeTab === "dashboard" && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn || !isPunchAllowedNow()}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
                  isPunchedIn || !isPunchAllowedNow()
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <LogIn className="w-5 h-5" />
                Punch In
              </button>

              <button
                onClick={handlePunchOut}
                disabled={!isPunchedIn}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
                  !isPunchedIn
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <LogOut className="w-5 h-5" />
                Punch Out
              </button>
            </div>

            {isPunchedIn && (
              <div className="flex items-center gap-2 text-indigo-700 mt-2">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>Total Time:</span>
                <span className="font-mono font-semibold">{timer}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "dashboard" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Total Employees"
                value={summary?.totalEmployees}
                Icon={Users}
                color="border-indigo-500"
              />
              <StatCard
                title="On Leave Today"
                value={summary?.onLeave}
                Icon={BedDouble}
                color="border-yellow-400"
              />
              <StatCard
                title="Present Today"
                value={summary?.presentToday}
                Icon={CheckCircle2}
                color="border-green-500"
              />
              <StatCard
                title="Pending Leaves"
                value={summary?.pendingLeaves}
                Icon={MailWarning}
                color="border-red-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold mb-2">Daily Attendance</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={summary?.dailyAttendance}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="present"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold mb-2">Leave Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={summary?.leaveTrends}>
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
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold mb-2">Department Split</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={summary?.deptData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                    >
                      {summary?.deptData?.map((entry, index) => (
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
        )}
        {activeTab === "manual-approvals" && (
          <div className="mt-8">
            <ManualApproval token={token} />
          </div>
        )}
        {activeTab === "freelancers" && <FreelancerTable token={token} />}

        {/* Message */}
        {(successMessage || error || message) && (
          <div className="mt-6 text-sm font-medium text-blue-600">
            {successMessage || error || message}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;

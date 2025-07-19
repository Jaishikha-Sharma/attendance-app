import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ManualPunchRequest from "../components/ManualPunchRequest";
import {
  LogIn,
  LogOut,
  UserCheck,
  CalendarCheck,
  Clock,
  Menu,
  History,
} from "lucide-react";
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";
import { applyLeave, clearLeaveMessages } from "../redux/leaveSlice";

const EmployeeDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { successMessage, error } = useSelector((state) => state.leave);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [message, setMessage] = useState("");
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [timer, setTimer] = useState("00:00:00");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Fetch status
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
        console.log("Error fetching status:", err);
      }
    };
    fetchStatus();
  }, [token]);

  // ✅ Timer
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

  // ✅ Fetch History
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${ATTENDANCE_API}/my-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history.slice(0, 7));
    } catch (err) {
      console.log("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePunchIn = async () => {
    try {
      const res = await axios.post(
        `${ATTENDANCE_API}/punch-in`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) return;
    dispatch(applyLeave({ date: leaveDate, reason: leaveReason, token }));
    setLeaveDate("");
    setLeaveReason("");
    setTimeout(() => dispatch(clearLeaveMessages()), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100">
      {/* ✅ Sidebar */}
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
          {[
            { id: "dashboard", label: "Dashboard", icon: <UserCheck /> },
            { id: "leave", label: "Apply Leave", icon: <CalendarCheck /> },
            { id: "manual", label: "Manual Punch-In", icon: <Clock /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === id ? "bg-indigo-900" : "hover:bg-indigo-600"
              }`}
            >
              <span className="w-5 h-5">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* ✅ Mobile Sidebar Toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded-full shadow-md"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ✅ Main Content */}
      <div className="flex-1 p-6 sm:p-10">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-indigo-800">
              Dashboard
            </h2>

            {/* Punch Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold text-white shadow-md transition-all duration-300 ${
                  isPunchedIn
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
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold text-white shadow-md transition-all duration-300 ${
                  !isPunchedIn
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <LogOut className="w-5 h-5" />
                Punch Out
              </button>
            </div>

            {/* Live Timer */}
            {isPunchedIn && (
              <div className="flex items-center gap-3 text-indigo-700 bg-indigo-100 rounded-lg px-4 py-3 shadow w-fit mb-10">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">Total Time:</span>
                <span className="font-mono text-lg font-semibold">{timer}</span>
              </div>
            )}

            {/* Attendance History */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                <History className="w-5 h-5 text-indigo-600" />
                Recent Attendance History
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-indigo-50 text-indigo-700 font-semibold text-left">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Punch In</th>
                      <th className="px-6 py-3">Punch Out</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-6 text-gray-500"
                        >
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-3">{item.date}</td>
                          <td className="px-6 py-3">
                            {item.punchInTime
                              ? new Date(item.punchInTime).toLocaleTimeString()
                              : "—"}
                          </td>
                          <td className="px-6 py-3">
                            {item.punchOutTime
                              ? new Date(item.punchOutTime).toLocaleTimeString()
                              : "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : item.status === "Leave"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {item.status || "NA"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "leave" && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-indigo-500" />
              Apply for Leave
            </h2>
            <form onSubmit={handleLeaveSubmit} className="space-y-4 max-w-md">
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Reason for leave..."
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
              >
                Submit Leave Request
              </button>
            </form>
          </>
        )}

        {activeTab === "manual" && <ManualPunchRequest />}

        {(successMessage || error || message) && (
          <div className="mt-6 text-sm font-medium text-blue-600">
            {successMessage || error || message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

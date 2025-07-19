import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LogIn,
  LogOut,
  UserCheck,
  CalendarCheck,
  Clock,
  Menu,
  History,
  ShoppingCart,
  BookOpenText,
} from "lucide-react";
import axios from "axios";
import { ATTENDANCE_API } from "../utils/Constant";
import { applyLeave, clearLeaveMessages } from "../redux/leaveSlice";
import SalesCRM from "../components/SalesCRM.jsx";
import OrderForm from "../components/OrderForm.jsx";
import ResourcesComponent from "../components/ResourcesComponent.jsx";

const SalesDashboard = () => {
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
          <p className="text-sm text-indigo-200">
            Department: {user?.department}
          </p>
        )}
        <hr className="border-indigo-500" />

        {/* Nav Items */}
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
              activeTab === "dashboard"
                ? "bg-indigo-900"
                : "hover:bg-indigo-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            {!collapsed && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
              activeTab === "leave" ? "bg-indigo-900" : "hover:bg-indigo-600"
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            {!collapsed && <span>Apply Leave</span>}
          </button>
          <button
            onClick={() => setActiveTab("crm")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
              activeTab === "crm" ? "bg-indigo-900" : "hover:bg-indigo-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            {!collapsed && <span>CRM</span>}
          </button>
          <button
            onClick={() => setActiveTab("order")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
              activeTab === "order" ? "bg-indigo-900" : "hover:bg-indigo-600"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {!collapsed && <span>Order Form</span>}
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
              activeTab === "resources"
                ? "bg-indigo-900"
                : "hover:bg-indigo-600"
            }`}
          >
            <BookOpenText className="w-5 h-5" />
            {!collapsed && <span>Resources</span>}
          </button>
        </nav>
      </div>

      {/* Toggle button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded-full shadow-md"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            {/* Punch Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
                  isPunchedIn
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <LogIn className="w-5 h-5" /> Punch In
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
                <LogOut className="w-5 h-5" /> Punch Out
              </button>
            </div>

            {/* Timer */}
            {isPunchedIn && (
              <div className="flex items-center gap-2 text-indigo-700 mb-6">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>Total Time:</span>
                <span className="font-mono font-semibold">{timer}</span>
              </div>
            )}

            {/* Attendance History Heading */}
            <h2 className="text-2xl font-bold mb-4 mt-6 flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-500" /> Attendance History
            </h2>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-indigo-100 text-indigo-700 text-left text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Punch In</th>
                    <th className="px-4 py-3">Punch Out</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item._id} className="border-t text-sm">
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">
                          {item.punchInTime
                            ? new Date(item.punchInTime).toLocaleTimeString()
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          {item.punchOutTime
                            ? new Date(item.punchOutTime).toLocaleTimeString()
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Leave"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
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
          </>
        )}

        {activeTab === "leave" && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-indigo-500" /> Apply for
              Leave
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
        {activeTab === "crm" && <SalesCRM />}

        {activeTab === "order" && (
          <>
            <OrderForm />
          </>
        )}

        {activeTab === "resources" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Resources</h2>
            <ResourcesComponent />
          </>
        )}
        {(successMessage || error || message) && (
          <div className="mt-6 text-sm font-medium text-blue-600">
            {successMessage || error || message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;

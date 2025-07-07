import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LogIn,
  LogOut,
  UserCheck,
  CalendarCheck,
  Clock,
  Menu,
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
        className={`sm:w-64 w-full sm:block ${
          showSidebar ? "" : "hidden"
        } bg-indigo-700 text-white p-6 space-y-6 sm:min-h-screen shadow-lg`}
      >
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xl font-bold">
          <UserCheck className="w-6 h-6" />
          <span>{user?.name}</span>
        </div>
        <p className="text-sm text-indigo-200">Role: {user?.role}</p>
        <hr className="border-indigo-500" />
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === "dashboard"
                ? "bg-indigo-900"
                : "hover:bg-indigo-600"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === "leave" ? "bg-indigo-900" : "hover:bg-indigo-600"
            }`}
          >
            Apply Leave
          </button>
        </nav>
      </div>

      {/* ✅ Mobile toggle button */}
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
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
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
              <div className="flex items-center gap-2 mt-6 text-indigo-700">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>Total Time:</span>
                <span className="font-mono font-semibold">{timer}</span>
              </div>
            )}
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

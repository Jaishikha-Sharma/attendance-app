import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Clock,
  LogIn,
  LogOut,
  Menu,
  UserCheck,
  History,
} from "lucide-react";
import {
  fetchFreelancerStatus,
  punchInFreelancer,
  punchOutFreelancer,
  clearFreelanceMessage,
} from "../redux/freelanceAttendanceSlice";

const FreelancerDashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const {
    isPunchedIn,
    punchInTime,
    loading,
    message,
    error,
  } = useSelector((state) => state.freelancerAttendance);

  const [timer, setTimer] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchFreelancerStatus(token));
  }, [dispatch, token]);

  useEffect(() => {
    let interval;
    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(punchInTime);
        const diff = Math.floor((now - start) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = () => dispatch(punchInFreelancer(token));
  const handlePunchOut = () => dispatch(punchOutFreelancer(token));

  useEffect(() => {
    if (message || error) {
      setTimeout(() => dispatch(clearFreelanceMessage()), 4000);
    }
  }, [message, error, dispatch]);

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
          {[{ id: "dashboard", label: "Dashboard", icon: <UserCheck /> }].map(
            ({ id, label, icon }) => (
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
            )
          )}
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
            <h2 className="text-2xl font-bold mb-6">Freelancer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn || loading}
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
                disabled={!isPunchedIn || loading}
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

        {(message || error) && (
          <div
            className={`mt-6 text-sm font-medium ${
              message ? "text-green-600" : "text-red-600"
            }`}
          >
            {message || error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;

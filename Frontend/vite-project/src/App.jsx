// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Static components
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

// Lazy-loaded components
const LoginSignup = lazy(() => import("./components/auth/LoginSignup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const HRDashboard = lazy(() => import("./pages/HRDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard"));
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));
const CoordinatorDashboard = lazy(() => import("./pages/CoordinatorDashboard"));
const HRLeaveApproval = lazy(() => import("./pages/HRLeaveApproval"));
const Profile = lazy(() => import("./pages/Profile"));
const SalesDashboard = lazy(() => import("./pages/SalesDashboard"));

// Dashboard layout with Navbar
const DashboardLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginSignup />} />

          {/* Routes that share the layout (with Navbar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route
              path="/freelancer-dashboard"
              element={<FreelancerDashboard />}
            />
            <Route
              path="/coordinator-dashboard"
              element={<CoordinatorDashboard />}
            />
            <Route path="/sales-dashboard" element={<SalesDashboard />} />
            <Route path="/hr/leave-approval" element={<HRLeaveApproval />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Chat & Toast */}
      <ChatWidget />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

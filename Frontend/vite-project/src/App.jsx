// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginSignup from "./components/auth/LoginSignup";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import Navbar from "./components/Navbar";
import HRLeaveApproval from "./pages/HRLeaveApproval";
import Profile from "./pages/Profile";

function App() {
  // Layout wrapper with Navbar for dashboard routes only
  const DashboardLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginSignup />} />

        {/* Grouped dashboard routes with Navbar */}
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
          <Route path="/hr/leave-approval" element={<HRLeaveApproval />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

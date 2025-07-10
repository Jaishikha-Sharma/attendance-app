import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const renderLinksByRole = (role) => {
    switch (role) {
      case "Admin":
        return (
          <>
            <a href="/admin-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/manage-users" className="nav-link">
              Users
            </a>
            <a href="/reports" className="nav-link">
              Reports
            </a>
          </>
        );
      case "HR":
        return (
          <>
            <a href="/hr-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/hr/leave-approval" className="nav-link">
              Approvals
            </a>
            <a href="/profile" className="nav-link">
              Profile
            </a>
          </>
        );
      case "Employee":
        return (
          <>
            <a href="/employee-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/profile" className="nav-link">
              Profile
            </a>
          </>
        );
      case "Freelancer":
        return (
          <a href="/freelancer-dashboard" className="nav-link">
            Dashboard
          </a>
        );
      case "Project Coordinator":
        return (
          <>
            <a href="/coordinator-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/profile" className="nav-link">
              Profile
            </a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 flex-wrap md:flex-nowrap">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-gray-900 font-bold text-lg"
        >
          <img
            src="/pb.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover shadow ring-2 ring-indigo-300"
          />
          <span>PB Workspace</span>
        </a>

        {/* Hamburger */}
        <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Navigation Links */}
        <nav
          className={`w-full md:w-auto md:flex gap-5 items-center text-sm mt-4 md:mt-0 ${
            mobileOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:gap-5">
            {user?.role && renderLinksByRole(user.role)}
          </div>
        </nav>

        {/* User & Logout */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {user && (
            <span className="flex items-center text-gray-600 text-sm font-medium">
              <User className="w-4 h-4 mr-1 text-indigo-600" />
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded flex items-center gap-1"
          >
            Logout
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

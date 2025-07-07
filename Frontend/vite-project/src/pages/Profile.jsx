import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Mail,
  ShieldCheck,
  Building2,
  CalendarDays,
} from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const goToDashboard = () => {
    switch (user?.role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      case "HR":
        navigate("/hr-dashboard");
        break;
      case "Employee":
        navigate("/employee-dashboard");
        break;
      case "Freelancer":
        navigate("/freelancer-dashboard");
        break;
      case "Co-Admin":
        navigate("/coordinator-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl px-10 py-12 w-full max-w-3xl border border-gray-200">
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center shadow-md ring-4 ring-indigo-300">
              <User className="w-10 h-10 text-indigo-700" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-[15px] px-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Email:</span> {user?.email}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Employee ID:</span> {user?.empId}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Role:</span> {user?.role}
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Department:</span> {user?.department}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Joined:</span>{" "}
            {new Date(user?.createdAt).toDateString()}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={goToDashboard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

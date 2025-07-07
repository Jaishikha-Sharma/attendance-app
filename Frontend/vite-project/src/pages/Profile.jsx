import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Mail, ShieldCheck, Building2, CalendarDays } from "lucide-react";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2 bg-indigo-100 p-4 rounded-full">
            <User className="text-indigo-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Name:</span> {user?.name}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Email:</span> {user?.email}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Employee ID:</span> {user?.empId}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Role:</span> {user?.role}
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Department:</span> {user?.department}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Joined:</span> {new Date(user?.createdAt).toDateString()}
          </div>
        </div>

        <button
          onClick={goToDashboard}
          className="mt-8 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-semibold transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Profile;

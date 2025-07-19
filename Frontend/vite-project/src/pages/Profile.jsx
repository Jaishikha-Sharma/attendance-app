import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Briefcase,
  Mail,
  ShieldCheck,
  Building2,
  CalendarDays,
  Edit3,
  Save,
} from "lucide-react";
import { updateUserProfile } from "../redux/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    empId: user?.empId || "",
    department: user?.department || "",
    contactNo: user?.contactNo || "",
    address: user?.address || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Update failed: " + error);
    }
  };

  const goToDashboard = () => {
    if (user?.role === "Employee" && user?.department === "Sales") {
      navigate("/sales-dashboard");
      return;
    }
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
          {[
            { label: "Name", icon: User, key: "name" },
            { label: "Email", icon: Mail, key: "email" },
            { label: "Employee ID", icon: Briefcase, key: "empId" },
            { label: "Department", icon: Building2, key: "department" },
            { label: "Contact No", icon: ShieldCheck, key: "contactNo" },
            { label: "Address", icon: CalendarDays, key: "address" },
            { label: "DOB", icon: CalendarDays, key: "dob", type: "date" },
          ].map(({ label, icon: Icon, key, type = "text" }) => (
            <div className="flex items-center gap-2" key={key}>
              <Icon className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">{label}:</span>
              {editMode ? (
                <input
                  type={type}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border-b border-indigo-300 focus:outline-none px-1 text-sm w-full"
                />
              ) : (
                <span>{formData[key] || "—"}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-4">
          <button
            onClick={goToDashboard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Go to Dashboard
          </button>
          <button
            onClick={editMode ? handleUpdate : () => setEditMode(true)}
            className={`${
              editMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            {editMode ? (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

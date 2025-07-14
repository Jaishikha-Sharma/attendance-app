import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../../redux/authSlice.js";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (error) setMessage({ type: "error", text: error });
    else setMessage(null);
  }, [error]);

  useEffect(() => {
    if (token && user) {
      const msg = {
        type: "success",
        text: isLogin
          ? `✅ Welcome back, ${user.name}!`
          : `✅ Signup successful for ${user.name}!`,
      };
      setMessage(msg);
      setTimeout(() => setMessage(null), 2000);

      // 🔥 Role + Department Based Routing
      if (user.role === "Admin") navigate("/admin-dashboard");
      else if (user.role === "HR") navigate("/hr-dashboard");
      else if (user.role === "Freelancer") navigate("/freelancer-dashboard");
      else if (user.role === "Co-Admin" || user.role === "Project Coordinator")
        navigate("/coordinator-dashboard");
      else if (user.role === "Employee" && user.department === "Sales")
        navigate("/sales-dashboard");
      else if (user.role === "Employee") navigate("/employee-dashboard");
      else navigate("/");
    }
  }, [token, user]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage(null);
    setFormData({
      name: "",
      empId: "",
      email: "",
      password: "",
      role: "",
      department: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (isLogin) {
      dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
    } else {
      dispatch(signupUser(formData));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3 mb-6">
        <img
          src="/pb.jpg"
          alt="PB Logo"
          className="w-10 h-10 rounded-full object-cover shadow ring-2 ring-indigo-300"
        />
        <h1 className="text-3xl font-extrabold tracking-widest text-indigo-700 uppercase drop-shadow-md">
          PB WORKSPACE
        </h1>
      </div>

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-5xl">
        {/* Left Info */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-800">
              Track. Punch. Analyze.
            </h1>
            <p className="mt-4 text-gray-700 text-sm">
              Empower your employees with real-time attendance insights.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-5">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
                <input
                  type="text"
                  name="empId"
                  placeholder="Employee ID"
                  value={formData.empId}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="input-style"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Co-Admin">Co-Admin</option>
                  <option value="Employee">Employee</option>
                  <option value="HR">HR</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Project Coordinator">
                    Project Coordinator
                  </option>
                </select>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input-style"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Project Coordinator">
                    Project Coordinator
                  </option>
                  <option value="Developer">Developer</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-style"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-style"
            />

            <button
              type="submit"
              disabled={loading}
              className={`h-11 mt-2 rounded-md font-semibold text-white text-sm transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 hover:scale-[1.02]"
              }`}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 text-indigo-600 font-bold hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

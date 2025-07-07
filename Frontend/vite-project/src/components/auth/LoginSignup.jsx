import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../../redux/authSlice.js';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, user } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    email: '',
    password: '',
    role: '',
    department: '',
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (error) setMessage({ type: 'error', text: error });
    else setMessage(null);
  }, [error]);

  useEffect(() => {
    if (token && user) {
      const msg = {
        type: 'success',
        text: isLogin
          ? `✅ Welcome back, ${user.name}!`
          : `✅ Signup successful for ${user.name}!`,
      };
      setMessage(msg);
      setTimeout(() => setMessage(null), 2000);

      // Redirect to dashboard based on role
      switch (user.role) {
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'HR':
          navigate('/hr-dashboard');
          break;
        case 'Employee':
          navigate('/employee-dashboard');
          break;
        case 'Freelancer':
          navigate('/freelancer-dashboard');
          break;
        case 'Co-Admin':
          navigate('/coordinator-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [token, user]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage(null);
    setFormData({
      name: '',
      empId: '',
      email: '',
      password: '',
      role: '',
      department: '',
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(
        signupUser({
          name: formData.name,
          empId: formData.empId,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department,
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-8">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className={`flex flex-col ${loading ? 'opacity-70 pointer-events-none' : ''}`}
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
                className="input"
              />
              <input
                type="text"
                name="empId"
                placeholder="Employee ID"
                value={formData.empId}
                onChange={handleChange}
                required
                className="input"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Co-Admin">Co-Admin</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Freelancer">Freelancer</option>
              </select>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Project Coordinator">Project Coordinator</option>
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
            className="input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className={`h-12 rounded-full font-bold text-white text-lg shadow-md transition-transform ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.type === 'error' ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message.text}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleForm}
            className="ml-1 text-indigo-600 hover:underline font-semibold"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;

// src/pages/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ATTENDANCE_API } from '../utils/Constant';
import { Clock, LogIn, LogOut, UserCheck } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [timer, setTimer] = useState('00:00:00');

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
          localStorage.setItem('isPunchedIn', 'true');
          localStorage.setItem('punchInTime', punchTime.toISOString());
        } else {
          setIsPunchedIn(false);
          setPunchInTime(null);
          localStorage.removeItem('isPunchedIn');
          localStorage.removeItem('punchInTime');
        }
      } catch (err) {
        console.log('Error fetching status:', err);
      }
    };

    fetchStatus();
  }, [token]);

  // ⏱️ Timer logic
  useEffect(() => {
    let interval;
    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - punchInTime) / 1000);
        const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const seconds = String(diff % 60).padStart(2, '0');
        setTimer(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = async () => {
    try {
      const res = await axios.post(`${ATTENDANCE_API}/punch-in`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const now = new Date();
      setMessage(res.data.message);
      setIsPunchedIn(true);
      setPunchInTime(now);
      localStorage.setItem('isPunchedIn', 'true');
      localStorage.setItem('punchInTime', now.toISOString());
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching in');
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await axios.post(`${ATTENDANCE_API}/punch-out`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      setIsPunchedIn(false);
      setPunchInTime(null);
      setTimer('00:00:00');
      localStorage.removeItem('isPunchedIn');
      localStorage.removeItem('punchInTime');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error punching out');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2 bg-indigo-100 p-4 rounded-full">
            <UserCheck className="text-indigo-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handlePunchIn}
            disabled={isPunchedIn}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
              isPunchedIn
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <LogIn className="w-5 h-5" />
            Punch In
          </button>

          <button
            onClick={handlePunchOut}
            disabled={!isPunchedIn}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
              !isPunchedIn
                ? 'bg-red-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <LogOut className="w-5 h-5" />
            Punch Out
          </button>
        </div>

        {isPunchedIn && (
          <div className="flex items-center justify-center gap-3 mt-4 text-gray-700">
            <Clock className="text-indigo-500 w-5 h-5 animate-pulse" />
            <span className="text-sm">Total Time:</span>
            <span className="font-mono font-bold text-indigo-700 text-lg">{timer}</span>
          </div>
        )}

        {message && (
          <div className="mt-6 text-center text-sm text-blue-600 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

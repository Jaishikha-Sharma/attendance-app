// components/ManualApproval.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManualPunchRequests,
  approvePunchRequest,
  rejectPunchRequest,
} from "../redux/manualPunchSlice";

const ManualApproval = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.manualPunch);

  useEffect(() => {
    dispatch(fetchManualPunchRequests());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approvePunchRequest({ id }));
  };

  const handleReject = (id) => {
    dispatch(rejectPunchRequest({ id }));
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Manual Punch Requests</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && requests.length === 0 && (
        <p className="text-gray-500">No pending requests found.</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-gray-300 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p><strong>Employee:</strong> {req.userId?.name}</p>
              <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(req._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualApproval;

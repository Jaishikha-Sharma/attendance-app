import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLeaves, updateLeaveStatus } from "../redux/leaveSlice";
import { CheckCircle2, XCircle } from "lucide-react";

const HRLeaveApproval = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { leaves, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchAllLeaves(token));
  }, [dispatch, token]);

  const handleAction = (id, status) => {
    dispatch(updateLeaveStatus({ id, status, token }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📋 Leave Requests</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white shadow-md p-4 rounded-md border border-gray-200"
            >
              <p><strong>Employee:</strong> {leave.userId?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(leave.date).toDateString()}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                  leave.status === "Pending" ? "bg-yellow-500" :
                  leave.status === "Approved" ? "bg-green-600" :
                  "bg-red-600"
                }`}>
                  {leave.status}
                </span>
              </p>

              {leave.status === "Pending" && (
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => handleAction(leave._id, "Approved")}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <CheckCircle2 size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(leave._id, "Rejected")}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRLeaveApproval;

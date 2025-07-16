import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManualPunchRequests,
  approveManualPunchRequest,
  rejectManualPunchRequest,
  clearManualPunchMessages,
} from "../redux/manualPunchSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManualApproval = ({ token }) => {
  const dispatch = useDispatch();
  const { requests, loading, error, successMessage } = useSelector(
    (state) => state.manualPunch
  );

  useEffect(() => {
    if (token) dispatch(fetchManualPunchRequests(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearManualPunchMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearManualPunchMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleApprove = (id) => {
    dispatch(approveManualPunchRequest({ id, token }));
  };

  const handleReject = (id) => {
    dispatch(rejectManualPunchRequest({ id, token }));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Manual Punch-In Approvals</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No manual punch-in requests found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Requested Date</th>
              <th className="p-2 border">Requested Time</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={req._id}>
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{req.userId.name}</td>
                <td className="p-2 border">{req.userId.email}</td>
                <td className="p-2 border">{req.userId.role}</td>
                <td className="p-2 border">{req.requestedDate}</td>
                <td className="p-2 border">{req.requestedTime}</td>
                <td className="p-2 border">{req.reason}</td>
                <td className="p-2 border">{req.status}</td>
                <td className="p-2 border space-x-2">
                  {req.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManualApproval;

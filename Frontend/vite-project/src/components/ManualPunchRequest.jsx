import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitManualPunchRequest } from "../redux/manualPunchSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clock } from "lucide-react";

const ManualPunchRequest = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { successMessage, error, loading } = useSelector(
    (state) => state.manualPunch
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time || !reason) return;

    dispatch(
      submitManualPunchRequest({
        requestedDate: date,
        requestedTime: time,
        reason,
        token,
      })
    );

    setDate("");
    setTime("");
    setReason("");
  };

  useEffect(() => {
    if (successMessage) {
      toast.success("Request submitted! HR will contact you soon.", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [successMessage, error]);

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-indigo-500" />
        Manual Punch-In Request
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md"
      >
        <input
          type="date"
          className="w-full border rounded px-4 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="w-full border rounded px-4 py-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded px-4 py-2"
          placeholder="Reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ManualPunchRequest;

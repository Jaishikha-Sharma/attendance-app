import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const DuePaymentModal = ({ isOpen, onClose, orderId, currentDue, dispatch, updateDueAmount }) => {
  const [duePaid, setDuePaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleSubmit = () => {
    const duePaidAmount = Number(duePaid);

    // 🚫 Input Validation
    if (!duePaidAmount || duePaidAmount <= 0 || duePaidAmount > currentDue) {
      alert("Enter a valid due amount (should not exceed current due).");
      return;
    }

    if (!paymentMode || !paymentDate) {
      alert("Please select payment mode and payment date.");
      return;
    }

    const finalDue = currentDue - duePaidAmount;

    // ✅ Dispatch Redux action to update due
    dispatch(
      updateDueAmount({
        orderId,
        dueAmount: finalDue,
        paymentMode,
        paymentDate,
      })
    );

    onClose();
  };

  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold text-indigo-700 mb-4 text-center">
            Update Due Payment
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter amount paid"
              value={duePaid}
              onChange={(e) => setDuePaid(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Payment Mode</option>
              <option value="PayTM">PayTM</option>
              <option value="GPay">GPay</option>
              <option value="PhonePy">PhonePy</option>
              <option value="NEFT/IMPS/RTGS">NEFT/IMPS/RTGS</option>
              <option value="Razorpay Gateway">Razorpay Gateway</option>
              <option value="Cheque/DD">Cheque/DD</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            <p className="text-sm font-medium text-gray-700">
              Remaining Due After Payment: ₹{currentDue - (Number(duePaid) || 0)}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DuePaymentModal;

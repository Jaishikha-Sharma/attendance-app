// components/DeliveryStatusModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

const DeliveryStatusModal = ({
  isOpen,
  onClose,
  currentStatus,
  onSave,
}) => {
  const [status, setStatus] = useState(currentStatus || "Pending");

  const handleSave = () => {
    onSave(status);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-indigo-700">
                Update Delivery Status
              </Dialog.Title>
              <button onClick={onClose} className="hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="UnDelivered">UnDelivered</option>
              </select>

              <button
                onClick={handleSave}
                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeliveryStatusModal;

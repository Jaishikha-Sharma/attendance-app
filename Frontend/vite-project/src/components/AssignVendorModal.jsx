import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Eye, Search } from "lucide-react";

const AssignVendorModal = ({
  isOpen,
  onClose,
  freelancers = [],
  selectedOrder,
  vendorName,
  setVendorName,
  dispatch,
  assignVendor,
  setShowVendorDetailModal,
  setSelectedFreelancer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const fields = [
      freelancer.name,
      freelancer.email,
      freelancer.state,
      freelancer.stream,
      freelancer.course,
      freelancer.specialized,
      freelancer.department,
      freelancer.role,
      freelancer.address,
    ];
    return fields.some((field) =>
      (field || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
          <Dialog.Title className="text-xl font-semibold text-indigo-700 mb-5 flex items-center gap-2">
            Assign Vendor
          </Dialog.Title>

          {/* Search Box */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search by name, state, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Freelancer List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer._id}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md hover:bg-indigo-50 border border-gray-200 transition cursor-pointer"
                  onClick={() => setVendorName(freelancer.name)}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {freelancer.name}{" "}
                    <span className="text-xs text-gray-500">
                      ({freelancer.email})
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFreelancer(freelancer);
                      setShowVendorDetailModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4 text-sm">
                No matching vendors
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (vendorName.trim()) {
                  dispatch(
                    assignVendor({
                      orderId: selectedOrder._id,
                      vendorName,
                    })
                  );
                  onClose();
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AssignVendorModal;

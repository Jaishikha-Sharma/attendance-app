import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, User } from "lucide-react";

const VendorDetailModal = ({ isOpen, onClose, freelancer }) => {
  if (!freelancer) return null;

  const {
    name,
    email,
    contactNo,
    alternateContact,
    state,
    stream,
    course,
    specialized,
    activityTime,
    address,
    department,
    role,
    joiningDate,
    dob,
  } = freelancer;

  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Contact No", value: contactNo || "N/A" },
    { label: "Alternate Contact", value: alternateContact || "N/A" },
    { label: "DOB", value: dob?.slice(0, 10) || "N/A" },
    { label: "Stream", value: stream || "N/A" },
    { label: "Course", value: course || "N/A" },
    {
      label: "Specialized In",
      value: specialized ? (
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {specialized.split(",").map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
        </ul>
      ) : (
        "N/A"
      ),
    },
    { label: "Department", value: department || "N/A" },
    { label: "Role", value: role || "Freelancer" },
    { label: "Joining Date", value: joiningDate?.slice(0, 10) || "N/A" },
    { label: "Activity Time", value: activityTime || "N/A" },
    { label: "State", value: state || "N/A" },
    { label: "Address", value: address || "N/A" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <User className="w-6 h-6" />
                <Dialog.Title className="text-lg font-semibold">
                  Freelancer Details
                </Dialog.Title>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-100 text-sm">
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="odd:bg-white even:bg-gray-50 transition hover:bg-gray-100"
                    >
                      <td className="px-4 py-3 font-medium w-1/3 border-r border-gray-200 text-gray-600">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VendorDetailModal;

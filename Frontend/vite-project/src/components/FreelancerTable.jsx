import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFreelancers,
  updateFreelancerActionables,
} from "../redux/freelancerSlice";
import {
  Loader2,
  PencilLine,
  Save,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const FreelancerTable = ({ token }) => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.freelancers);

  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [editField, setEditField] = useState(null); // 👈 track field being edited
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [formData, setFormData] = useState({
    status: "",
    activityTime: "",
    aadhaarCardNumber: "",
    panCardNumber: "",
    tags: "",
  });

  useEffect(() => {
    if (token) dispatch(fetchFreelancers(token));
  }, [dispatch, token]);

  const totalPages = Math.ceil(list.length / recordsPerPage);
  const currentRecords = list.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleFieldEdit = (freelancer, field) => {
    setSelectedFreelancer(freelancer);
    setEditField(field);
    setFormData({
      status: freelancer.status || "",
      activityTime: freelancer.activityTime || "",
      aadhaarCardNumber: freelancer.aadhaarCardNumber || "",
      panCardNumber: freelancer.panCardNumber || "",
      tags: freelancer.tags?.join(", ") || "",
    });
  };

  const handleSave = () => {
    const payload = {
      status: formData.status,
      activityTime: formData.activityTime,
      aadhaarCardNumber: formData.aadhaarCardNumber,
      panCardNumber: formData.panCardNumber,
      tags: formData.tags.split(",").map((t) => t.trim()),
    };
    dispatch(
      updateFreelancerActionables({
        id: selectedFreelancer._id,
        payload,
        token,
      })
    );
    setEditField(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Create Vendor Button */}
      <div className="mb-4 flex justify-end">
        <a
          href="https://forms.gle/f9GVf3BJfJfbVEyr8"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Create Vendor
        </a>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b text-left">Timestamp</th>
              <th className="px-4 py-3 border-b text-left">Emp ID</th>
              <th className="px-4 py-3 border-b text-left">Name</th>
              <th className="px-4 py-3 border-b text-left">Dept</th>
              <th className="px-4 py-3 border-b text-left">Status</th>
              <th className="px-4 py-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-600">
                  <Loader2 className="animate-spin inline-block mr-2" />
                  Loading freelancers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-red-600">
                  <AlertTriangle className="inline-block mr-2" />
                  {error}
                </td>
              </tr>
            ) : currentRecords.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No freelancers found.
                </td>
              </tr>
            ) : (
              currentRecords.map((freelancer) => (
                <tr
                  key={freelancer._id}
                  className="border-t hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => {
                    setSelectedFreelancer(freelancer);
                    setEditField(null);
                  }}
                >
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(freelancer.timestamp).toLocaleString() || "-"}
                  </td>
                  <td className="px-4 py-3">{freelancer.empId || "-"}</td>
                  <td className="px-4 py-3">{freelancer.name || "-"}</td>
                  <td className="px-4 py-3">{freelancer.department || "-"}</td>
                  <td className="px-4 py-3">{freelancer.status || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {list.length > recordsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedFreelancer && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[95%] max-w-4xl relative max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-300">
            <button
              onClick={() => {
                setSelectedFreelancer(null);
                setEditField(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
              Freelancer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
              {/* Static Info */}
              <div className="bg-gray-50 border rounded-xl p-4 space-y-2 shadow-sm">
                <p>
                  <strong>Emp ID:</strong> {selectedFreelancer.empId}
                </p>
                <p>
                  <strong>Name:</strong> {selectedFreelancer.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedFreelancer.email}
                </p>
                <p>
                  <strong>Contact No:</strong> {selectedFreelancer.contactNo}
                </p>
                <p>
                  <strong>Department:</strong> {selectedFreelancer.department}
                </p>
                <p>
                  <strong>Role:</strong> {selectedFreelancer.role}
                </p>
              </div>

              {/* Editable Fields */}
              <div className="bg-gray-50 border rounded-xl p-4 space-y-3 shadow-sm">
                {[
                  "status",
                  "activityTime",
                  "aadhaarCardNumber",
                  "panCardNumber",
                  "tags",
                ].map((field) => (
                  <div
                    key={field}
                    className="flex justify-between items-start gap-4"
                  >
                    <strong className="capitalize whitespace-nowrap">
                      {field.replace(/([A-Z])/g, " $1")}:
                    </strong>
                    <div className="flex-1 text-right">
                      {editField === field ? (
                        <input
                          type="text"
                          className="border px-2 py-1 rounded w-full text-sm"
                          value={formData[field]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="flex justify-end items-center gap-2">
                          <span className="text-gray-700">
                            {field === "tags"
                              ? selectedFreelancer.tags?.join(", ") || "-"
                              : selectedFreelancer[field] || "-"}
                          </span>
                          <button
                            onClick={() =>
                              handleFieldEdit(selectedFreelancer, field)
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilLine size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* More Static Info */}
              <div className="bg-gray-50 border rounded-xl p-4 space-y-2 shadow-sm">
                <p>
                  <strong>State:</strong> {selectedFreelancer.state}
                </p>
                <p>
                  <strong>Stream:</strong> {selectedFreelancer.stream}
                </p>
                <p>
                  <strong>Course:</strong> {selectedFreelancer.course}
                </p>
                <p>
                  <strong>Address:</strong> {selectedFreelancer.address}
                </p>
              </div>

              <div className="bg-gray-50 border rounded-xl p-4 space-y-2 shadow-sm">
                <p>
                  <strong>Joining Date:</strong>{" "}
                  {selectedFreelancer.joiningDate
                    ? new Date(
                        selectedFreelancer.joiningDate
                      ).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {selectedFreelancer.dob
                    ? new Date(selectedFreelancer.dob).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {selectedFreelancer.createdAt
                    ? new Date(selectedFreelancer.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            {editField && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerTable;

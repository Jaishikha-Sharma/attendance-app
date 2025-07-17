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
  UserCircle2,
  BadgeCheck,
  Timer,
  ListChecks,
  Contact2,
  Landmark,
} from "lucide-react";

const FreelancerTable = ({ token }) => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.freelancers);

  const [editId, setEditId] = useState(null);
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

  const handleEdit = (freelancer) => {
    setEditId(freelancer._id);
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
    dispatch(updateFreelancerActionables({ id: editId, payload, token }));
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b text-left">Timestamp</th>
              <th className="px-4 py-3 border-b text-left">Emp ID</th>
              <th className="px-4 py-3 border-b text-left">Name</th>
              <th className="px-4 py-3 border-b text-left">Dept</th>
              <th className="px-4 py-3 border-b text-left">Status</th>
              <th className="px-4 py-3 border-b text-left">Activity Time</th>
              <th className="px-4 py-3 border-b text-left">Aadhaar</th>
              <th className="px-4 py-3 border-b text-left">PAN</th>
              <th className="px-4 py-3 border-b text-left">Tags</th>
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
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No freelancers found.
                </td>
              </tr>
            ) : (
              list.map((freelancer) => (
                <tr
                  key={freelancer._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(freelancer.timestamp).toLocaleString() || "-"}
                  </td>
                  <td className="px-4 py-3">{freelancer.empId || "-"}</td>
                  <td className="px-4 py-3">{freelancer.name || "-"}</td>
                  <td className="px-4 py-3">{freelancer.department || "-"}</td>

                  {editId === freelancer._id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={formData.activityTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              activityTime: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={formData.aadhaarCardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aadhaarCardNumber: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={formData.panCardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              panCardNumber: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={formData.tags}
                          onChange={(e) =>
                            setFormData({ ...formData, tags: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 justify-center text-xs"
                        >
                          <Save size={16} /> Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">{freelancer.status || "-"}</td>
                      <td className="px-4 py-3">
                        {freelancer.activityTime || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {freelancer.aadhaarCardNumber || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {freelancer.panCardNumber || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {freelancer.tags?.length > 0
                          ? freelancer.tags.join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(freelancer)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center text-sm"
                        >
                          <PencilLine size={16} /> Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreelancerTable;

import React, { useState } from "react";

const VendorGroupForm = () => {
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({ status, link });
  };

  const handleCancel = () => {
    setStatus("");
    setLink("");
    setSubmitted(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-64 border">
      <h3 className="text-center font-semibold text-indigo-700 border border-blue-400 rounded px-2 py-1 mb-3">
        Vendor Group
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <select
          className="border px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-300"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Choose Status</option>
          <option value="Active">Active</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="url"
          placeholder="Vendor Group Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <div className="flex justify-between mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mt-4 text-sm bg-gray-50 border rounded p-2">
          <p>
            <span className="font-medium text-gray-700">Status:</span>{" "}
            <span className="text-indigo-600">{submitted.status}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Group Link:</span>{" "}
            <a
              href={submitted.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {submitted.link}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorGroupForm;

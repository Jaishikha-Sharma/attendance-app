import React, { useState } from "react";
import { ExternalLink, Pencil } from "lucide-react";
import { toast } from "react-toastify";

const VendorGroupForm = ({ vendorGroupLink = "", onSave }) => {
  const [link, setLink] = useState(vendorGroupLink);
  const [editing, setEditing] = useState(!vendorGroupLink);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!link.trim()) return;

    try {
      setSaving(true);
      await onSave(link);
      toast.success("Vendor group link updated!");
      setEditing(false);
    } catch (err) {
      console.error("Failed to update:", err);
      toast.error("Failed to update vendor group link.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLink(vendorGroupLink);
    setEditing(false);
  };

  const handleOpenLink = () => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="bg-white shadow border rounded-lg p-3 w-full max-w-sm">
      <h3 className="text-sm font-semibold text-indigo-700 mb-2 border-b pb-1">
        Vendor Group
      </h3>

      {editing ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Paste group link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="text-xs bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`text-xs px-3 py-1 rounded text-white ${
                saving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : link ? (
        <div className="flex flex-col items-start gap-2">
          <button
            onClick={handleOpenLink}
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open Group
          </button>
          <span className="text-green-600 text-[11px] bg-green-100 px-2 py-0.5 rounded font-medium">
            Active Link
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            Edit Link
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 text-xs mb-2">
            No vendor group link added.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 text-xs font-medium hover:underline"
          >
            Add Link
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorGroupForm;

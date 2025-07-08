import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { LEAD_API } from "../utils/Constant";
import { PlusCircle, X } from "lucide-react";
import { Fragment } from "react";

const SalesCRM = () => {
  const { token } = useSelector((state) => state.auth);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerContact: "",
    customerEmail: "",
    city: "",
    state: "",
    servicesRequired: "",
    description: "",
    dueDate: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${LEAD_API}/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${LEAD_API}/create-lead`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        customerName: "",
        customerContact: "",
        customerEmail: "",
        city: "",
        state: "",
        servicesRequired: "",
        description: "",
        dueDate: "",
      });
      setAddModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error("Failed to create lead:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          📋 Sales CRM - Leads
        </h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
        >
          <PlusCircle className="w-5 h-5" />
          New Lead
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-3">Lead ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Quotation</th>
              <th className="px-4 py-3">Response</th>
              <th className="px-4 py-3">Enquiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedLead(lead);
                    setViewModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3">{lead.leadNo}</td>
                  <td className="px-4 py-3">{lead.customerName}</td>
                  <td className="px-4 py-3">{lead.servicesRequired}</td>
                  <td className="px-4 py-3">{lead.customerContact}</td>
                  <td className="px-4 py-3">{lead.quotation || "—"}</td>
                  <td className="px-4 py-3">{lead.response || "—"}</td>
                  <td className="px-4 py-3">{lead.enquiry || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setAddModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
              >
                <Dialog.Panel className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold text-indigo-700">
                     Add New Lead
                    </Dialog.Title>
                    <button onClick={() => setAddModalOpen(false)} className="hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleLeadSubmit} className="grid grid-cols-2 gap-4 text-sm">
                    <input type="text" name="customerName" placeholder="Customer Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required className="input-style col-span-2" />
                    <input type="text" name="customerContact" placeholder="Contact" value={form.customerContact} onChange={(e) => setForm({ ...form, customerContact: e.target.value })} required className="input-style" />
                    <input type="email" name="customerEmail" placeholder="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} required className="input-style" />
                    <input type="text" name="city" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-style" />
                    <input type="text" name="state" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-style" />
                    <input type="text" name="servicesRequired" placeholder="Services" value={form.servicesRequired} onChange={(e) => setForm({ ...form, servicesRequired: e.target.value })} className="input-style" />
                    <input type="date" name="dueDate" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-style" />
                    <textarea name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-style col-span-2 resize-none" rows={3} />
                    <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Submit</button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Lead Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setViewModalOpen(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-indigo-700">📄 Lead Details</Dialog.Title>
                <button onClick={() => setViewModalOpen(false)} className="hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {selectedLead && (
                <div className="space-y-2 text-sm text-gray-800">
                  <p><strong>Lead No:</strong> {selectedLead.leadNo}</p>
                  <p><strong>Lead Date:</strong> {new Date(selectedLead.leadDate).toLocaleString()}</p>
                  <p><strong>Name:</strong> {selectedLead.customerName}</p>
                  <p><strong>Contact:</strong> {selectedLead.customerContact}</p>
                  <p><strong>Email:</strong> {selectedLead.customerEmail}</p>
                  <p><strong>City:</strong> {selectedLead.city}</p>
                  <p><strong>State:</strong> {selectedLead.state}</p>
                  <p><strong>Service:</strong> {selectedLead.servicesRequired}</p>
                  <p><strong>Due:</strong> {new Date(selectedLead.dueDate).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {selectedLead.description}</p>
                  <p><strong>Actioned By:</strong> {selectedLead.actionedBy}</p>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SalesCRM;

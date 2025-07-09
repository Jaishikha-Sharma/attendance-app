import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { PlusCircle, X } from "lucide-react";
import { LEAD_API } from "../utils/Constant";

const SalesCRM = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

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

  const [extraForm, setExtraForm] = useState({
    leadSource: "",
    leadStatus: "",
    contactedViaCall: "",
    quotationStatus: "",
    enquiryStatus: "",
    orderDate: "",
    orderValue: "",
    quotation: "",
    response: "",
    enquiry: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${LEAD_API}/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedLead) {
      setExtraForm({
        leadSource: selectedLead.leadSource || "",
        leadStatus: selectedLead.leadStatus || "",
        contactedViaCall: selectedLead.contactedViaCall || "",
        quotationStatus: selectedLead.quotationStatus || "",
        enquiryStatus: selectedLead.enquiryStatus || "",
        orderDate: selectedLead.orderDate?.slice(0, 10) || "",
        orderValue: selectedLead.orderValue || "",
        quotation: selectedLead.quotation || "",
        response: selectedLead.response || "",
        enquiry: selectedLead.enquiry || "",
      });
    }
  }, [selectedLead]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = leads.filter(
      (lead) =>
        lead.customerName.toLowerCase().includes(value) ||
        lead.servicesRequired.toLowerCase().includes(value) ||
        lead.leadNo.toLowerCase().includes(value)
    );
    setFilteredLeads(filtered);
    setCurrentPage(1);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${LEAD_API}/create-lead`,
        {
          ...form,
          actionedBy: user.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleUpdateLead = async () => {
    try {
await axios.put(`${LEAD_API}/update-lead/${selectedLead._id}`, extraForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error("Failed to update lead:", err);
    }
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          📋 Sales CRM - Leads
        </h2>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-64 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
          >
            <PlusCircle className="w-5 h-5" />
            New Lead
          </button>
        </div>
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
            {currentLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              currentLeads.map((lead) => (
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Lead Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setAddModalOpen(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-indigo-700">➕ Add New Lead</Dialog.Title>
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
          </div>
        </Dialog>
      </Transition>

      {/* View Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setViewModalOpen(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
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

                  <div className="grid gap-3 pt-4 border-t mt-4">
                    <label>Lead Source
                      <select className="input-style" value={extraForm.leadSource} onChange={(e) => setExtraForm({ ...extraForm, leadSource: e.target.value })}>
                        <option value="">Choose Source</option>
                        <option value="social media">Social Media</option>
                        <option value="search engine/website">Search Engine/Website</option>
                        <option value="reference">Reference</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    <label>Lead Status
                      <select className="input-style" value={extraForm.leadStatus} onChange={(e) => setExtraForm({ ...extraForm, leadStatus: e.target.value })}>
                        <option value="">Choose Status</option>
                        <option value="contacted">Contacted</option>
                        <option value="not contacted">Not Contacted</option>
                      </select>
                    </label>

                    <label>Contacted Via Call?
                      <select className="input-style" value={extraForm.contactedViaCall} onChange={(e) => setExtraForm({ ...extraForm, contactedViaCall: e.target.value })}>
                        <option value="">Choose</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>

                    <label>Quotation Status
                      <select className="input-style" value={extraForm.quotationStatus} onChange={(e) => setExtraForm({ ...extraForm, quotationStatus: e.target.value })}>
                        <option value="">Choose</option>
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                      </select>
                    </label>

                    <label>Enquiry Status
                      <select className="input-style" value={extraForm.enquiryStatus} onChange={(e) => setExtraForm({ ...extraForm, enquiryStatus: e.target.value })}>
                        <option value="">Choose</option>
                        <option value="open">Open</option>
                        <option value="close">Close</option>
                      </select>
                    </label>

                    <label>Order Date
                      <input type="date" className="input-style" value={extraForm.orderDate} onChange={(e) => setExtraForm({ ...extraForm, orderDate: e.target.value })} />
                    </label>

                    <label>Order Value
                      <input type="text" className="input-style" placeholder="Order Value" value={extraForm.orderValue} onChange={(e) => setExtraForm({ ...extraForm, orderValue: e.target.value })} />
                    </label>

                    <label>Quotation
                      <input type="text" className="input-style" placeholder="Quotation" value={extraForm.quotation} onChange={(e) => setExtraForm({ ...extraForm, quotation: e.target.value })} />
                    </label>

                    <label>Response
                      <input type="text" className="input-style" placeholder="Response" value={extraForm.response} onChange={(e) => setExtraForm({ ...extraForm, response: e.target.value })} />
                    </label>

                    <label>Enquiry
                      <input type="text" className="input-style" placeholder="Enquiry" value={extraForm.enquiry} onChange={(e) => setExtraForm({ ...extraForm, enquiry: e.target.value })} />
                    </label>

                    <button onClick={handleUpdateLead} className="bg-indigo-600 text-white rounded-lg px-4 py-2 mt-3 hover:bg-indigo-700 transition">
                      Update Lead
                    </button>
                  </div>
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


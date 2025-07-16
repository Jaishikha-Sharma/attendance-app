import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { X, Pencil, Eye } from "lucide-react";
import { fetchCoordinatorOrders } from "../redux/orderSlice";
import { assignVendor } from "../redux/orderSlice";
import { fetchFreelancers } from "../redux/freelancerSlice";
import VendorDetailModal from "./VendorDetailModal";
import AssignVendorModal from "./AssignVendorModal";
import DuePaymentModal from "./DuePaymentModal";
import { updateDueAmount } from "../redux/orderSlice";
import { updateInstitution } from "../redux/orderSlice";
import VendorGroupForm from "../components/VendorGroupForm";
import { updateVendorGroupLink } from "../redux/orderSlice";
import DeliveryStatusModal from "./DeliveryStatusModal";
import { updateDeliveryStatus } from "../redux/orderSlice";
import CustomerGroupForm from "../components/CustomerGroupForm";
import { updateCustomerGroupLink } from "../redux/orderSlice";

const CoordinatorCrm = ({ selectedOrder, setSelectedOrder }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.order || {});
  const { list: freelancers } = useSelector((state) => state.freelancers);

  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showVendorDetailModal, setShowVendorDetailModal] = useState(false);
  const [isDueModalOpen, setIsDueModalOpen] = useState(false);
  const [isEditingInstitution, setIsEditingInstitution] = useState(false);
  const [institutionInput, setInstitutionInput] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCoordinatorOrders());
      dispatch(fetchFreelancers(token));
    }
  }, [dispatch, token]);
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o._id === selectedOrder._id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        Assigned Orders
      </h2>

      {/* DESKTOP TABLE (hidden on small screens) */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-indigo-50 cursor-pointer transition"
                  onClick={() => {
                    setSelectedOrder(order);
                    setViewModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    #{order.orderNo || order._id.slice(-5).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.vendor || "N/A"}</td>
                  <td className="px-4 py-3">{order.topic}</td>
                  <td className="px-4 py-3">
                    {order.deadline &&
                      new Date(order.deadline)
                        .toLocaleDateString("en-GB")
                        .replaceAll("/", "-")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.deliveryStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.deliveryStatus === "In-Transit"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {["Delivered", "In-Transit", "Undelivered"].includes(
                        order.deliveryStatus
                      )
                        ? order.deliveryStatus
                        : "Undelivered"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE VIEW CARDS (hidden on md and above) */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => {
              setSelectedOrder(order);
              setViewModalOpen(true);
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-indigo-700">
                #{order.orderNo || order._id.slice(-5).toUpperCase()}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  order.deliveryStatus === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.deliveryStatus === "In-Transit"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {["Delivered", "In-Transit", "Undelivered"].includes(
                  order.deliveryStatus
                )
                  ? order.deliveryStatus
                  : "Undelivered"}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-800">Customer:</span>{" "}
              {order.customerName}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-800">Vendor:</span>{" "}
              {order.vendor || "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-800">Topic:</span>{" "}
              {order.topic}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-800">Deadline:</span>{" "}
              {order.deadline &&
                new Date(order.deadline)
                  .toLocaleDateString("en-GB")
                  .replaceAll("/", "-")}
            </p>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setViewModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white w-full max-w-5xl rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-indigo-700">
                  📝 Order Details
                </Dialog.Title>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedOrder && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
                  {/* Basic Info Card */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-2 tracking-wide">
                      Basic Information
                    </h3>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Order No:
                      </span>{" "}
                      #{selectedOrder.orderNo || selectedOrder._id}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Deadline:
                      </span>{" "}
                      {selectedOrder.deadline && (
                        <span className="text-indigo-700 font-semibold bg-yellow-100 px-2 py-0.5 rounded">
                          {new Date(selectedOrder.deadline)
                            .toLocaleDateString("en-GB")
                            .replaceAll("/", "-")}
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Order Date:
                      </span>{" "}
                      {selectedOrder.orderDate &&
                        new Date(selectedOrder.orderDate)
                          .toLocaleDateString("en-GB")
                          .replaceAll("/", "-")}
                    </p>

                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-medium text-gray-800">Status:</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium tracking-wide ${
                          selectedOrder.deliveryStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : selectedOrder.deliveryStatus === "In-Transit"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {["Delivered", "In-Transit", "Undelivered"].includes(
                          selectedOrder.deliveryStatus
                        )
                          ? selectedOrder.deliveryStatus
                          : "Undelivered"}
                      </span>

                      {selectedOrder.dueAmount === 0 && (
                        <button
                          onClick={() => setIsStatusModalOpen(true)}
                          className="p-1 rounded hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 transition"
                          aria-label="Edit Status"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </p>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-indigo-50 p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-2 tracking-wide">
                      Customer Details
                    </h3>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Name:</span>{" "}
                      <span className="text-indigo-700 font-semibold bg-yellow-100 px-2 py-0.5 rounded">
                        {selectedOrder.customerName}
                      </span>
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Email:</span>{" "}
                      {selectedOrder.customerEmail}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Contact:
                      </span>{" "}
                      {selectedOrder.contact}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Address:
                      </span>{" "}
                      {selectedOrder.customerAddress}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">State:</span>{" "}
                      <span className="text-gray-800 font-semibol px-2 py-0.5 rounded">
                        {selectedOrder.state}
                      </span>
                    </p>

                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        Institution:
                      </span>
                      {isEditingInstitution ? (
                        <>
                          <input
                            type="text"
                            value={institutionInput}
                            onChange={(e) =>
                              setInstitutionInput(e.target.value)
                            }
                            className="border px-2 py-1 rounded-md text-sm w-[160px]"
                          />
                          <button
                            onClick={() => {
                              dispatch(
                                updateInstitution({
                                  orderId: selectedOrder._id,
                                  institution: institutionInput,
                                })
                              );
                              setIsEditingInstitution(false);
                            }}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingInstitution(false)}
                            className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{selectedOrder.institution || "N/A"}</span>
                          <button
                            onClick={() => {
                              setInstitutionInput(
                                selectedOrder.institution || ""
                              );
                              setIsEditingInstitution(true);
                            }}
                            className="p-1 rounded hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 transition"
                            aria-label="Edit Institution"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Project Info Card */}
                  <div className="bg-green-50 p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-2 tracking-wide">
                      Project Details
                    </h3>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Topic:</span>{" "}
                      {selectedOrder.topic}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Type:</span>{" "}
                      {selectedOrder.projectType}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">
                        Purpose:
                      </span>{" "}
                      {selectedOrder.purpose}
                    </p>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Notes:</span>{" "}
                      {selectedOrder.notes || "-"}
                    </p>
                  </div>

                  {/* Payment Info Card */}
                  <div className="bg-yellow-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-1">
                      Payment Details
                    </h3>
                    <p>
                      <span className="font-medium">Selling Price:</span> ₹
                      {selectedOrder.sellingPrice}
                    </p>
                    <p>
                      <span className="font-medium">Advance:</span> ₹
                      {selectedOrder.advanceAmount}
                    </p>
                    <p>
                      <span className="font-medium">Payment Mode:</span>{" "}
                      {selectedOrder.advanceMode}
                    </p>
                    <p className="flex items-center gap-2 mt-2">
                      <span className="font-medium">Due Amount:</span> ₹
                      {selectedOrder?.dueAmount ?? 0}
                      <button
                        onClick={() => setIsDueModalOpen(true)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </p>
                    <p>
                      <span className="font-medium">Due Amount Date:</span>{" "}
                      {selectedOrder?.duePaymentDate
                        ? new Date(
                            selectedOrder.duePaymentDate
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </p>
                    <p>
                      <span className="font-medium">Due Amount Mode:</span>{" "}
                      {selectedOrder?.duePaymentMode || "-"}
                    </p>
                  </div>

                  {/* Status Info Card */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-gray-200 shadow-sm md:col-span-2 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">
                      Order Status
                    </h3>

                    {/* Vendor Info Row */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Vendor:</span>
                      <span
                        className={`${
                          !selectedOrder.vendor
                            ? "animate-pulse text-red-600 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {selectedOrder.vendor || "Not Assigned"}
                      </span>
                      <button
                        onClick={() => {
                          setVendorName(selectedOrder.vendor || "");
                          setIsVendorModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 👇 Side-by-side Group Sections */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Vendor Group Section */}
                      <div className="bg-purple-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">
                          Vendor Group
                        </h4>
                        <VendorGroupForm
                          vendorGroupLink={selectedOrder.vendorGroupLink}
                          onSave={(newLink) => {
                            dispatch(
                              updateVendorGroupLink({
                                orderId: selectedOrder._id,
                                vendorGroupLink: newLink,
                              })
                            );
                          }}
                        />
                      </div>

                      {/* Customer Group Section */}
                      <div className="bg-blue-100 p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">
                          Customer Group
                        </h4>
                        <CustomerGroupForm
                          customerGroupLink={selectedOrder.customerGroupLink}
                          onSave={(newLink) => {
                            dispatch(
                              updateCustomerGroupLink({
                                orderId: selectedOrder._id,
                                customerGroupLink: newLink,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
            <AssignVendorModal
              isOpen={isVendorModalOpen}
              onClose={() => setIsVendorModalOpen(false)}
              freelancers={freelancers}
              selectedOrder={selectedOrder}
              vendorName={vendorName}
              setVendorName={setVendorName}
              dispatch={dispatch}
              assignVendor={assignVendor}
              setShowVendorDetailModal={setShowVendorDetailModal}
              setSelectedFreelancer={setSelectedFreelancer}
            />
          </div>
        </Dialog>
      </Transition>
      <VendorDetailModal
        isOpen={showVendorDetailModal}
        onClose={() => setShowVendorDetailModal(false)}
        freelancer={selectedFreelancer}
      />
      <DuePaymentModal
        isOpen={isDueModalOpen}
        onClose={() => setIsDueModalOpen(false)}
        orderId={selectedOrder?._id}
        currentDue={selectedOrder?.dueAmount}
        dispatch={dispatch}
        updateDueAmount={updateDueAmount}
        onDueUpdate={(newDue) =>
          setSelectedOrder((prev) => ({
            ...prev,
            dueAmount: newDue,
          }))
        }
      />
      <DeliveryStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={selectedOrder?.deliveryStatus}
        onSave={(newStatus) => {
          dispatch(
            updateDeliveryStatus({
              orderId: selectedOrder._id,
              deliveryStatus: newStatus,
            })
          );
        }}
      />
    </div>
  );
};

export default CoordinatorCrm;

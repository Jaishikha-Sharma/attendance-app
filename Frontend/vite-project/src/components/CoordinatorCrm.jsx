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

const CoordinatorCrm = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.order || {});
  const { list: freelancers } = useSelector((state) => state.freelancers);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showVendorDetailModal, setShowVendorDetailModal] = useState(false);
  const [isDueModalOpen, setIsDueModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCoordinatorOrders());
      dispatch(fetchFreelancers(token));
    }
  }, [dispatch, token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        Assigned Orders
      </h2>

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
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No assigned orders.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
                  <td className="px-4 py-3">{order.deadline?.slice(0, 10)}</td>
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
                      {order.deliveryStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            <Dialog.Panel className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
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
                  <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-1">
                      Basic Information
                    </h3>
                    <p>
                      <span className="font-medium">Order No:</span> #
                      {selectedOrder.orderNo || selectedOrder._id}
                    </p>
                    <p>
                      <span className="font-medium">Deadline:</span>{" "}
                      {selectedOrder.deadline?.slice(0, 10)}
                    </p>
                    <p>
                      <span className="font-medium">Order Date:</span>{" "}
                      {selectedOrder.orderDate?.slice(0, 10)}
                    </p>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-indigo-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-1">
                      Customer Details
                    </h3>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.customerEmail}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {selectedOrder.contact}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedOrder.customerAddress}
                    </p>
                    <p>
                      <span className="font-medium">Institution:</span>{" "}
                      {selectedOrder.institution}
                    </p>
                  </div>

                  {/* Project Info Card */}
                  <div className="bg-green-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-1">
                      Project Details
                    </h3>
                    <p>
                      <span className="font-medium">Topic:</span>{" "}
                      {selectedOrder.topic}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedOrder.projectType}
                    </p>
                    <p>
                      <span className="font-medium">Purpose:</span>{" "}
                      {selectedOrder.purpose}
                    </p>
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
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
                  </div>

                  {/* Status Info Card */}
                  <div className="bg-blue-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out md:col-span-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b pb-1">
                      Order Status
                    </h3>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Vendor:</span>
                      {selectedOrder.vendor || "N/A"}
                      <button
                        onClick={() => {
                          setVendorName(selectedOrder.vendor || "");
                          setIsVendorModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </p>

                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                          selectedOrder.deliveryStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.deliveryStatus === "In-Transit"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.deliveryStatus}
                      </span>
                    </p>
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
      />
    </div>
  );
};

export default CoordinatorCrm;

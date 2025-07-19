import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Clock,
  LogIn,
  LogOut,
  Menu,
  UserCheck,
  History,
  X,
  BookOpenText,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import {
  fetchFreelancerStatus,
  punchInFreelancer,
  punchOutFreelancer,
  clearFreelanceMessage,
} from "../redux/freelanceAttendanceSlice";
import { fetchVendorOrders } from "../redux/orderSlice";
import ResourcesComponent from "../components/ResourcesComponent";

const ITEMS_PER_PAGE = 10;

const FreelancerDashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { isPunchedIn, punchInTime, loading, message, error } = useSelector(
    (state) => state.freelancerAttendance
  );
  const { vendorOrders } = useSelector((state) => state.order);

  const [timer, setTimer] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchFreelancerStatus(token));
    dispatch(fetchVendorOrders());
  }, [dispatch, token]);

  useEffect(() => {
    let interval;
    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(punchInTime);
        const diff = Math.floor((now - start) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const s = String(diff % 60).padStart(2, "0");
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = () => dispatch(punchInFreelancer(token));
  const handlePunchOut = () => dispatch(punchOutFreelancer(token));

  useEffect(() => {
    if (message || error) {
      setTimeout(() => dispatch(clearFreelanceMessage()), 4000);
    }
  }, [message, error, dispatch]);

  const filteredOrders = vendorOrders
    ?.filter((order) =>
      [order.orderNo, order.customerName]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((order) =>
      statusFilter ? order.deliveryStatus === statusFilter : true
    )
    .filter((order) =>
      paymentFilter ? order.paymentStatus === paymentFilter : true
    );

  const totalPages = Math.ceil((filteredOrders?.length || 0) / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        className={`sm:block w-full sm:min-h-screen shadow-lg bg-indigo-700 text-white p-6 space-y-6 transition-all duration-300 ease-in-out ${
          collapsed ? "sm:w-20" : "sm:w-64"
        } ${showSidebar ? "" : "hidden"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <UserCheck className="w-6 h-6" />
            {!collapsed && <span>{user?.name}</span>}
          </div>
          <button
            className="text-white hover:text-indigo-300 sm:inline-block hidden"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 010-1.414L12.586 11H4a1 1 0 110-2h8.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 5.293a1 1 0 010 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        {!collapsed && (
          <p className="text-sm text-indigo-200">Role: {user?.role}</p>
        )}
        <hr className="border-indigo-500" />
        <nav className="space-y-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: <UserCheck /> },
            { id: "crm", label: "CRM", icon: <History /> },
            { id: "resources", label: "Resources", icon: <BookOpenText /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === id ? "bg-indigo-900" : "hover:bg-indigo-600"
              }`}
            >
              <span className="w-5 h-5">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded-full shadow-md"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Freelancer Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn || loading}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
                  isPunchedIn
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <LogIn className="w-5 h-5" />
                Punch In
              </button>
              <button
                onClick={handlePunchOut}
                disabled={!isPunchedIn || loading}
                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold shadow transition-all duration-300 ${
                  !isPunchedIn
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <LogOut className="w-5 h-5" />
                Punch Out
              </button>
            </div>

            {isPunchedIn && (
              <div className="flex items-center gap-2 mt-6 text-indigo-700">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>Total Time:</span>
                <span className="font-mono font-semibold">{timer}</span>
              </div>
            )}
          </>
        )}

        {activeTab === "crm" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Assigned Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search Order No or Customer..."
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="overflow-auto rounded-lg shadow">
              <table className="w-full table-auto bg-white">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr className="text-sm text-left">
                    <th className="p-3">Order No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Deadline</th>
                    <th className="p-3">Vendor Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {paginatedOrders?.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-3">{order.orderNo}</td>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3">
                        {order.deadline
                          ? new Date(order.deadline).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3">
                        ₹{order.vendorPrices?.[user.name] || 0}
                      </td>
                      <td className="p-3">{order.deliveryStatus}</td>
                      <td className="p-3">{order.paymentStatus}</td>
                    </tr>
                  ))}
                  {!paginatedOrders?.length && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        No matching orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "resources" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Resources</h2>
            <ResourcesComponent />
          </>
        )}

        {(message || error) && (
          <div
            className={`mt-6 text-sm font-medium ${
              message ? "text-green-600" : "text-red-600"
            }`}
          >
            {message || error}
          </div>
        )}
      </div>

      {/* ✅ Order Details Modal */}
      <Transition appear show={!!selectedOrder} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedOrder(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-semibold text-indigo-800">
                      Order Details
                    </Dialog.Title>
                    <button onClick={() => setSelectedOrder(null)}>
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder?._id}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {new Date(selectedOrder?.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Customer Name:</strong>{" "}
                      {selectedOrder?.customerName}
                    </p>
                    <p>
                      <strong>Project Topic:</strong>{" "}
                      {selectedOrder?.topic || "-"}
                    </p>
                    <p>
                      <strong>Vendor Amount:</strong> ₹
                      {selectedOrder?.vendorPrices || 0}
                    </p>
                    <p>
                      <strong>Assigned By:</strong>{" "}
                      {selectedOrder?.assignedBy || "Coordinator"}
                    </p>
                    <p>
                      <strong>Delivery Status:</strong>{" "}
                      {selectedOrder?.deliveryStatus}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {selectedOrder?.deadline
                        ? new Date(selectedOrder.deadline).toLocaleDateString()
                        : "-"}
                    </p>
                    <hr />
                    <p>
                      <strong>Chat Option:</strong>{" "}
                      {selectedOrder?.chatApprovedBy?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Invoice Generated on:</strong>{" "}
                      {selectedOrder?.invoiceGeneratedOn
                        ? new Date(
                            selectedOrder.invoiceGeneratedOn
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{" "}
                      {selectedOrder?.paymentStatus || "N/A"}
                    </p>
                    <p>
                      <strong>Customer Feedback:</strong>{" "}
                      {selectedOrder?.customerFeedback?.trim()
                        ? selectedOrder.customerFeedback
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Remarks by Management:</strong>{" "}
                      {selectedOrder?.remarksByManagement?.trim()
                        ? selectedOrder.remarksByManagement
                        : "N/A"}
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FreelancerDashboard;

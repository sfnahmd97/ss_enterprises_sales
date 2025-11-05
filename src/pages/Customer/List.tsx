import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import type { ListApiResponse } from "../../interfaces/common";
import Swal from "sweetalert2";
import Pagination from "../../components/common/Pagination";
import { ChevronLeft, X, Mail, Phone, MapPin, Calendar, User, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Main() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCustomer = async (page = 1, search = "") => {
    try {
      setLoading(true);

      const params: any = { page, per_page: perPage };
      if (search) params.search_key = search;
      const res = await api.get<ListApiResponse<any[]>>(`/sales/get-customers-list`, {
        params,
      });

      const response = res.data;

      setCustomers(response.data);
      setCurrentPage(response.meta.current_page);
      setPerPage(response.meta.per_page);
      setTotal(response.meta.total);
      setLastPage(response.meta.last_page);
    } catch (error: any) {
      console.error("Failed to fetch customers:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (id: number) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const res = await api.get(`sales/get-customer-details/${id}`);
      const data = (res.data as { data: any }).data;
      setSelectedCustomer(data);
    } catch (error: any) {
      console.error("Failed to fetch customer details:", error);
      toast.error("Failed to load details");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          title="Go to Dashboard"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 lg:p-6 border-b border-gray-200 gap-4">
            <h6 className="text-xl lg:text-2xl font-bold text-gray-900">Customers</h6>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2.5 w-full sm:w-72 text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchCustomer(1, e.target.value);
                }}
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
                    </td>
                  </tr>
                ) : customers.length > 0 ? (
                  customers.map((val, index) => (
                    <tr
                      key={val.id}
                      onClick={() => openModal(val.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * perPage + (index + 1)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{val.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {val.phone_no ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {val.location.location_name}, {val.district.name}, {val.state.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          val.status 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {val.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(val.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No customers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
              </div>
            ) : customers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {customers.map((val, index) => (
                  <div
                    key={val.id}
                    onClick={() => openModal(val.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {val.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            #{(currentPage - 1) * perPage + (index + 1)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          val.status 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {val.status ? "Active" : "Inactive"}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2 pl-15">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{val.phone_no ?? "N/A"}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          {val.location.location_name}, {val.district.name}, {val.state.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {new Date(val.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No customers found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && customers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              perPage={perPage}
              total={total}
              lastPage={lastPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative border-b border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {modalLoading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-sm text-gray-500">Loading details...</p>
                  </div>
                ) : selectedCustomer ? (
                  <div className="space-y-5">
                    {/* Name */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-green-50 rounded-lg">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                        <p className="text-base text-gray-900 font-medium">{selectedCustomer.name}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-blue-50 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                        <p className="text-sm text-gray-900 break-all">{selectedCustomer.email ?? "Not provided"}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-purple-50 rounded-lg">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.phone_no}</p>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-orange-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                        <p className="text-sm text-gray-900">
                          {selectedCustomer.location.location_name}
                          <span className="text-gray-500"> • </span>
                          {selectedCustomer.district.name}
                          <span className="text-gray-500"> • </span>
                          {selectedCustomer.state.name}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Account Status</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.status 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedCustomer.status
                          ? "Active"
                          : `Inactive • ${selectedCustomer.inactive_reason_label}`}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Member Since</p>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedCustomer.created_at).toLocaleDateString("en-IN", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-3">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600">No customer details available</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
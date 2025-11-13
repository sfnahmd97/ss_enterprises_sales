import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../lib/axios";
import type { ListApiResponse } from "../../interfaces/common";
import Swal from "sweetalert2";
import Pagination from "../../components/common/Pagination";
import { ChevronLeft, Search, Filter, X } from "lucide-react";

export default function Main() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // filters
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async (page = 1, search = "", status = "", start = "", end = "") => {
    try {
      setLoading(true);

      const params: any = { page, per_page: perPage };
      if (search) params.search_key = search;
      if (status) params.status = status;
      if (start) params.start_date = start;
      if (end) params.end_date = end;

      const res = await api.get<ListApiResponse<any[]>>(`/sales/order/get-order-list`, {
        params,
      });

      const response = res.data;

      setOrders(response.data);
      setCurrentPage(response.meta.current_page);
      setPerPage(response.meta.per_page);
      setTotal(response.meta.total);
      setLastPage(response.meta.last_page);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders(1, searchTerm, statusFilter, startDate, endDate);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchOrders(1, "", "", "", "");
  };

  const hasActiveFilters = statusFilter || startDate || endDate;

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter, startDate, endDate);
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
          <div className="p-5 lg:p-6 border-b border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h6 className="text-xl lg:text-2xl font-bold text-gray-900">Orders</h6>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2.5 w-full sm:w-72 text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      fetchOrders(1, e.target.value, statusFilter, startDate, endDate);
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    hasActiveFilters
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-white text-green-600 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {[statusFilter, startDate, endDate].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Apply
                    </button>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        title="Clear filters"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                    Order Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Delivery Date
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
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((val, index) => (
                    <tr
                      key={val.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * perPage + (index + 1)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{val.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {val.customer.name ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {val.customer.full_location}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {new Date(val.delivery_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          val.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          val.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          val.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                          val.status === 'confirmed' ? 'bg-cyan-100 text-cyan-700' :
                          val.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {val.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
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
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm text-gray-500">No orders found</p>
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
                <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {orders.map((val, index) => (
                  <div
                    key={val.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {val.code}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            val.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            val.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            val.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                            val.status === 'confirmed' ? 'bg-cyan-100 text-cyan-700' :
                            val.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {val.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{val.customer.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{val.customer.full_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Delivery: {new Date(val.delivery_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                      <span>Created: {new Date(val.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">No orders found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && orders.length > 0 && (
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
    </div>
  );
}
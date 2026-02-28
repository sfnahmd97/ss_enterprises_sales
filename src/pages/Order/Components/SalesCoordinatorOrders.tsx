import { useNavigate } from "react-router-dom";
import Modal from "../../../components/common/Modal";
import { useState } from "react";
import api from "../../../lib/axios";
import { Pencil, UserRoundSearch, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  orders: any[];
  loading: any;
  currentPage: any;
  perPage: any;
  updateOrderStatus: (id: number, assignStatus: string) => void;
}

const getStatusStyle = (status: string) => {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ";
  switch (status?.toLowerCase()) {
    case "delivered": return base + "bg-green-100 text-green-700";
    case "shipped": return base + "bg-blue-100 text-blue-700";
    case "processing": return base + "bg-purple-100 text-purple-700";
    case "confirmed": return base + "bg-cyan-100 text-cyan-700";
    case "cancelled": return base + "bg-red-100 text-red-700";
    default: return base + "bg-yellow-100 text-yellow-700";
  }
};

export default function SalesCoordinatorOrders({
  orders,
  loading,
  currentPage,
  perPage,
  updateOrderStatus,
}: Props) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");

  const openCustomerOrdersModal = async (customerId: number, name: string) => {
    try {
      setCustomerName(name);
      setShowModal(true);

      const res = await api.get(
        `/sales/order/get-customer-orders/${customerId}`
      );
      const data = (res.data as { data: any }).data;
      setCustomerOrders(data);
    } catch (err) {
      console.error("Failed to load customer orders", err);
    }
  };

  return (
    <div className="w-full">
      {/* Tablet & Mobile Card View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((val) => (
              <div
                key={val.id}
                onClick={() => navigate(`/orders/details/${val.id}`)}
                className="p-4 border-b border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-gray-900">{val.code}</span>
                  <span className={getStatusStyle(val.status)}>{val.status}</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <p className="text-sm font-medium text-gray-700">{val.customer?.name ?? "N/A"}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin size={12} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{val.customer?.full_location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1 flex-shrink-0" />
                    {new Date(val.delivery_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <p className="text-xs text-gray-600">
                    {val.person?.name} • {val.person?.designation_label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/orders/edit/${val.id}`}
                    className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => openCustomerOrdersModal(val.customer_id, val.customer?.name)}
                    className="p-2 bg-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-200"
                    title="View Customer Orders"
                  >
                    <UserRoundSearch size={16} />
                  </button>
                  {val.assign_status === "sales_coordinator" ? (
                    <button
                      onClick={() => updateOrderStatus(val.id, "production_manager")}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium"
                    >
                      Assign to PM
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 text-cyan-700">
                      {val.assign_label}
                    </span>
                  )}
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
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Person
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Person Type
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Action
            </th>
            {/* <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th> */}
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
                onClick={() => navigate(`/orders/details/${val.id}`)}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {(currentPage - 1) * perPage + (index + 1)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {val.code}
                    </span>
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
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {val.person.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {val.person.designation_label}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      val.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : val.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : val.status === "processing"
                        ? "bg-purple-100 text-purple-700"
                        : val.status === "confirmed"
                        ? "bg-cyan-100 text-cyan-700"
                        : val.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {val.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center text-sm text-gray-900">
                  {new Date(val.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td
                  className="px-6 py-4 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Link
                      to={`/orders/edit/${val.id}`}
                      className="inline-flex items-center justify-center p-2 bg-gray-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() =>
                        openCustomerOrdersModal(
                          val.customer_id,
                          val.customer.name
                        )
                      }
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      title="View Customer Orders"
                    >
                      <UserRoundSearch size={16} />
                    </button>
                    {val.assign_status === "sales_coordinator" ? (
                      <button
                        onClick={() =>
                          updateOrderStatus(val.id, "production_manager")
                        }
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Assign to PM
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 text-cyan-700">
                        {val.assign_label}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500">No orders found</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={`Orders for ${customerName}`}
        size="xl"
      >
        {customerOrders.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Order Code
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Delivery Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customerOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                      onClick={() => navigate(`/orders/details/${order.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.code}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.delivery_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No orders found for this customer.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

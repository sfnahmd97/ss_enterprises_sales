"use client";
import { useEffect, useState } from "react";
import StatCard from "../components/StateCard";
import { Users, ShoppingCart, Clock, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [customerCount, setCustomerCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [pendingOrders, setpendingOrders] = useState<any[]>([]);

  const userRole = useAuthStore((state) => state.user?.role);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/sales/get-dashboard-data`);
      const data = (res.data as { data: any }).data;
      setCustomerCount(data.customers_count);
      setPendingOrdersCount(data.pending_orders_count);
      setTotalOrdersCount(data.total_orders_count);
      setpendingOrders(data.latest_pending_orders);
    } catch {
      console.error("Failed to load user data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Welcome back 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Let’s review your latest store activity for today.
          </p>
        </div>

        {userRole != "sales_coordinator" && (
          <Link
            to="/orders/create"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Order
          </Link>
        )}
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
        <Link to="/customers/list">
          <StatCard
            title="Customers"
            value={customerCount}
            change="+3.3%"
            positive={true}
            icon={Users}
            color="blue"
          />
        </Link>
        <Link to="/orders/list">
          <StatCard
            title="Total Orders"
            value={totalOrdersCount}
            change="+5.1%"
            positive={true}
            icon={ShoppingCart}
            color="green"
          />
        </Link>
        <Link to="/orders/list?status=pending">
          <StatCard
            title="Pending Orders"
            value={pendingOrdersCount}
            change="-1.2%"
            positive={false}
            icon={Clock}
            color="orange"
          />
        </Link>
      </section>

      {/* Pending Orders */}
      <section className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Latest Pending Orders
          </h3>
          <Link
            to="/orders/list"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Tablet & Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/details/${order.id}`}
                className="block p-4 hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{order.code}</span>
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{order.customer?.name}</p>
                <p className="text-xs text-gray-500 truncate">{order.customer?.full_location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">No pending orders</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-lg">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-blue-50 transition cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                  onClick={() => navigate(`/orders/details/${order.id}`)}
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {order.code}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.customer?.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.customer?.full_location}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Home;

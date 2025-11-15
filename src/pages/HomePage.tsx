"use client";
import { useEffect, useState } from "react";
import StatCard from "../components/StateCard";
import { Users, ShoppingCart, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

const Home: React.FC = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [pendingOrders, setpendingOrders] = useState<any[]>([]);

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

        <Link
          to="/orders/create"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Order
        </Link>
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
        <Link to="/orders/list">
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

      {/* Pending Orders Table */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
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
                className={`hover:bg-blue-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-700">
                  {order.code}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.customer.name}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.customer.full_location}
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
      </section>
    </div>
  );
};

export default Home;

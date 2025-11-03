"use client";
import {useEffect, useState} from "react";
import StatCard from "../components/StateCard";
import { Users, ShoppingCart, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";


const Home: React.FC = () => {
  const pendingOrders = [
    { id: "ORD-1023", customer: "John Doe", date: "2025-10-28",  status: "Pending" },
    { id: "ORD-1022", customer: "Emily Smith", date: "2025-10-27",  status: "Pending" },
    { id: "ORD-1021", customer: "Michael Lee", date: "2025-10-25",  status: "Pending" },
    { id: "ORD-1020", customer: "Sarah Kim", date: "2025-10-24",  status: "Pending" },
    { id: "ORD-1019", customer: "David Johnson", date: "2025-10-23", status: "Pending" },
  ];

  const [customer_count, setCustomerCount] = useState(0);

  const fetchDashboardData = async () => {
        try {
          const res = await api.get(`/sales/get-dashboard-data`);
          const data = (res.data as { data: any }).data;
          setCustomerCount(data.customers_count);
        } catch {
          console.error("Failed to load user data");
        }
      };

      useEffect(()=>{
fetchDashboardData();
      },[]);

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
          value={customer_count}
          change="+3.3%"
          positive={true}
          icon={Users}
          color="blue"
        />
        </Link>
        <StatCard
          title="Total Orders"
          value={0}
          change="+5.1%"
          positive={true}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={0}
          change="-1.2%"
          positive={false}
          icon={Clock}
          color="orange"
        />
      </section>

      {/* Pending Orders Table */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Latest Pending Orders
        </h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-3 px-4 rounded-tl-lg">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="py-3 px-4 font-medium text-gray-700">{order.id}</td>
                <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                <td className="py-3 px-4 text-gray-600">{order.date}</td>
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

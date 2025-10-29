"use client";
import React from "react";
import StatCard from "../components/StateCard";
import { Users, ShoppingCart, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold">Welcome to Dashboard</h2>
        <div className="flex flex-wrap gap-3"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <StatCard
          title="CUSTOMERS"
          value="3,897"
          change="+3.3%"
          positive={true}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="TOTAL ORDERS"
          value="35,084"
          change="+5.1%"
          positive={true}
          icon={ShoppingCart}
          color="green"
        />

        <StatCard
          title="PENDING ORDERS"
          value="1,245"
          change="-1.2%"
          positive={false}
          icon={Clock}
          color="orange"
        />
      </div>

{/* Order Button */}
      <div className="flex justify-center my-6">
        <Link
          to="/orders/create"
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg shadow hover:opacity-90 transition"
        >
          <Plus size={20} className="text-white" />
          Add Order
        </Link>
      </div>

    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Loader,
  Check,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react";
import api from "../../lib/axios";
import Swal from "sweetalert2";

// --------------------------------------------
// 🟦 TYPES
// --------------------------------------------

type Status =
  | "delivered"
  | "shipped"
  | "processing"
  | "confirmed"
  | "cancelled"
  | "pending";

interface ASectionSize {
  id: number;
  size: string;
  door_part_id: number;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ASection {
  id: number;
  order_id: number;
  order_design_id: number;
  a_section_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  size: string;
  a_section_size: ASectionSize;
}

interface FrameSize {
  id: number;
  size: string;
  door_part_id: number;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FrameItem {
  id: number;
  order_id: number;
  order_design_id: number;
  frame_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  size: string;
  frame_size: FrameSize;
}

interface DesignType {
  id: number;
  title: string;
  short: string;
}

interface Finishing {
  id: number;
  title: string;
  short: string;
}

interface Design {
  id: number;
  design_number: string;
  design_type_id: number;
  design_type_short: string;
  panel_color_id: number;
  a_section_color_id: number;
  frame_color_id: number;
  image: string | null;
  image_name: string | null;
  design_code: string;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderDesign {
  id: number;
  order_id: number;
  design_id: number;
  design_type_id: number;
  panel_size_id: number;
  finishing_id: number;
  nos: number;
  created_at: string;
  updated_at: string;
  design_code: string;
  a_sections: ASection[];
  frames: FrameItem[];
  design_type: DesignType;
  finishing: Finishing;
  design: Design;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  state_id: number;
  district_id: number;
  location_id: number;
  brand_id: number;
  status: number;
  full_location: string;
  created_at: string;
  updated_at: string;
  created_by_type: string;
  created_by_id: number;
  created_by_type_label: string;
}

interface Order {
  id: number;
  code: string;
  person_type: string;
  person_id: number;
  customer_id: number;
  delivery_date: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

interface OrderData {
  order: Order;
  customer: Customer;
  order_designs: OrderDesign[];
}

// --------------------------------------------
// 🟦 STATUS COLORS + ICONS
// --------------------------------------------

const statusColors: Record<Status, string> = {
  delivered: "bg-green-100 text-green-700 border-green-200",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  confirmed: "bg-cyan-100 text-cyan-700 border-cyan-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const getStatusColor = (status?: string): string => {
  const key = (status ?? "").toLowerCase() as Status;
  return statusColors[key] ?? statusColors.pending;
};

const statusIcons: Record<Status, React.ReactElement> = {
  delivered: <CheckCircle className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  processing: <Loader className="w-5 h-5 animate-spin" />,
  confirmed: <Check className="w-5 h-5" />,
  cancelled: <XCircle className="w-5 h-5" />,
  pending: <Clock className="w-5 h-5" />,
};

const getStatusIcon = (status?: string): React.ReactElement => {
  const key = (status ?? "").toLowerCase() as Status;
  return statusIcons[key] ?? <Package className="w-5 h-5" />;
};

// --------------------------------------------
// 🟦 MAIN COMPONENT (TSX)
// --------------------------------------------

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/sales/order/get-order-details/${id}`);
      const data = (res.data as { data: OrderData }).data;
      setOrderData(data);
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to load order details",
      }).then(() => {
        navigate("/orders/list");
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error State - if no data after loading
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/orders/list")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const { order, customer, order_designs } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/orders/list")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium group"
          >
            <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={20} />
            <span>Back to Orders</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-lg text-gray-600">Order #{order.code}</p>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Order Info Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Customer Name */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                  <p className="font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{customer.full_location}</p>
                  <p className="text-xs text-gray-500">{customer.phone_no}</p>
                </div>
              </div>

              {/* Order Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString("en-IN", {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.delivery_date).toLocaleDateString("en-IN", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">Expected</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Order Designs Section */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          
          {/* Section Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Designs
              </h2>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                {order_designs.length} {order_designs.length === 1 ? 'Design' : 'Designs'}
              </span>
            </div>
          </div>

          <div className="p-6">
            {order_designs.length > 0 ? (
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-t-lg px-4 py-3 grid grid-cols-12 gap-3 text-white font-semibold text-sm">
                  <div className="col-span-1 text-center">S.No</div>
                  <div className="col-span-1">Design Code</div>
                  <div className="col-span-1">Design Type</div>
                  <div className="col-span-1">Finishing</div>
                  <div className="col-span-1 text-center">Panel Size</div>
                  <div className="col-span-1 text-center">Panel Nos</div>
                  <div className="col-span-1 text-center">Design No</div>
                  <div className="col-span-5">A-Sections & Frames</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-0">
                  {order_designs.map((design, index) => (
                    <div
                      key={design.id}
                      className="bg-white border-b-2 border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-4 py-4 grid grid-cols-12 gap-3 items-start">
                        
                        {/* S.No */}
                        <div className="col-span-1 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {index + 1}
                          </div>
                        </div>

                        {/* Design Code */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-gray-900 text-sm">{design.design_code}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {design.id}</p>
                        </div>

                        {/* Design Type */}
                        <div className="col-span-1">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200">
                            <div className="font-bold text-gray-900 text-sm">{design.design_type.title}</div>
                            <div className="text-xs text-gray-600">({design.design_type.short})</div>
                          </div>
                        </div>

                        {/* Finishing */}
                        <div className="col-span-1">
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 border border-purple-200">
                            <div className="font-bold text-gray-900 text-sm">{design.finishing.title}</div>
                            <div className="text-xs text-gray-600">({design.finishing.short})</div>
                          </div>
                        </div>

                        {/* Panel Size */}
                        <div className="col-span-1">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 border border-green-200 text-center">
                            <div className="font-bold text-gray-900 text-lg">#{design.panel_size_id}</div>
                            <div className="text-xs text-gray-600">Size</div>
                          </div>
                        </div>

                        {/* Panel Nos */}
                        <div className="col-span-1">
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 border border-orange-200 text-center">
                            <div className="font-bold text-gray-900 text-lg">{design.nos || "0"}</div>
                            <div className="text-xs text-gray-600">Qty</div>
                          </div>
                        </div>

                        {/* Design No */}
                        <div className="col-span-1">
                          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2 border border-pink-200 text-center">
                            <div className="font-bold text-gray-900 text-sm">{design.design.design_number || "N/A"}</div>
                            <div className="text-xs text-gray-600">No</div>
                          </div>
                        </div>

                        {/* A-Sections & Frames */}
                        <div className="col-span-5 space-y-2">
                          {/* A-Sections */}
                          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-transparent rounded-lg p-2 border-l-4 border-blue-500">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-900 uppercase min-w-[70px]">A Section:</span>
                              <div className="flex gap-2 flex-wrap">
                                {design.a_sections.map((section) => (
                                  <div
                                    key={section.id}
                                    className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm border border-blue-200"
                                  >
                                    <span className="text-xs text-blue-700 font-semibold">{section.size}:</span>
                                    <span className="text-sm font-bold text-gray-900">{section.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Frames */}
                          <div className="bg-gradient-to-r from-green-100 via-green-50 to-transparent rounded-lg p-2 border-l-4 border-green-500">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-green-900 uppercase min-w-[70px]">Frame:</span>
                              <div className="flex gap-2 flex-wrap">
                                {design.frames.map((frame) => (
                                  <div
                                    key={frame.id}
                                    className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm border border-green-200"
                                  >
                                    <span className="text-xs text-green-700 font-semibold">{frame.size}:</span>
                                    <span className="text-sm font-bold text-gray-900">{frame.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No designs found for this order</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Blob Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PanelSize,States,Districts,Location,ASectionSize,FrameSize,DesignType,Finishing } from "../../interfaces/common";

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
  panel_size: PanelSize;
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
  state : States;
  district_id: number;
  district: Districts;
  location_id: number;
  location: Location;
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
// Fixed column definitions with cumulative left offsets
// --------------------------------------------
const FIXED_COLS = [
  { label: "#",           width: 48  },
  { label: "Design",      width: 120 },
  { label: "Design Type", width: 100 },
  { label: "Finishing",   width: 120 },
  { label: "Panel Size",  width: 90  },
  { label: "Panel Nos",   width: 80  },
];

// Columns that should NOT wrap
const NO_WRAP_COLS = ["#", "Design", "Finishing"];

const fixedColMeta = FIXED_COLS.reduce<{ label: string; width: number; left: number }[]>(
  (acc, col, i) => {
    const left = i === 0 ? 0 : acc[i - 1].left + acc[i - 1].width;
    acc.push({ ...col, left });
    return acc;
  },
  []
);

// Row 1 header height — used to offset row 2 sticky top
const HEADER_ROW1_HEIGHT = 37;

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

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
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

  const allSectionSizes = Array.from(
    new Set(order_designs.flatMap((d) => d.a_sections.map((s) => s.size)))
  );
  const allFrameSizes = Array.from(
    new Set(order_designs.flatMap((d) => d.frames.map((f) => f.size)))
  );

  return (
    <div className="min-h-full w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto w-full flex-1 flex flex-col min-w-0">

        {/* Breadcrumb */}
        <div className="flex items-center mb-4 md:mb-6">
          <button
            onClick={() => navigate("/orders/list")}
            className="flex items-center gap-1 py-2 pr-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors font-medium group min-h-[44px]"
            aria-label="Back to Orders"
          >
            <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform flex-shrink-0" size={20} />
            <span>Back to Orders</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-base md:text-lg text-gray-600">Order #{order.code}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 flex-shrink-0 ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                  <p className="font-semibold text-gray-900 truncate" title={customer.name}>{customer.name}</p>
                  <p className="text-xs text-gray-500 truncate" title={customer.phone_no}>{customer.phone_no}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                  <p className="font-semibold text-gray-900 truncate" title={customer.location.location_name}>{customer.location.location_name}</p>
                  <p className="text-xs text-gray-500 truncate" title={`${customer.district.name}, ${customer.state.name}`}>{customer.district.name}, {customer.state.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.delivery_date).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">Expected</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Order Designs Table */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 overflow-hidden flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 min-w-0">
                <Package className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Order Designs</span>
              </h2>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold flex-shrink-0">
                {order_designs.length} {order_designs.length === 1 ? 'Design' : 'Designs'}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-6 flex-1">
            {order_designs.length > 0 ? (
              /*
               * KEY FIX:
               * 1. overflow-auto (both axes) enables the scroll container sticky needs
               * 2. max-h-[60vh] gives a bounded height so vertical scroll actually occurs
               * 3. touch-pan-x retained for tablet horizontal scroll
               */
              <div
                className="overflow-auto rounded-xl border border-gray-200 shadow-sm touch-pan-x"
                style={{ maxHeight: "60vh" }}
              >
                <table
                  className="text-sm border-separate border-spacing-0"
                  style={{ tableLayout: "fixed", width: "max-content", minWidth: "100%" }}
                >
                  <colgroup>
                    {fixedColMeta.map((col) => (
                      <col key={col.label} style={{ width: col.width }} />
                    ))}
                    {allSectionSizes.map((size) => (
                      <col key={`sec-${size}`} style={{ width: 130 }} />
                    ))}
                    {allFrameSizes.map((size) => (
                      <col key={`frm-${size}`} style={{ width: 130 }} />
                    ))}
                  </colgroup>

                  <thead>
                    {/* ── Row 1: group headers ── */}
                    <tr className="bg-gray-50">
                      {fixedColMeta.map((col) => (
                        <th
                          key={col.label}
                          rowSpan={2}
                          /*
                           * FIX: both `left` (horizontal freeze) and `top: 0`
                           * (vertical freeze) are required. z-30 keeps these
                           * corner cells above both scrolling header cells (z-20)
                           * and scrolling body cells (z-10).
                           */
                          style={{ left: col.left, top: 0 }}
                          className={`sticky bg-gray-50 z-30 text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-b-gray-200 border-r border-r-gray-200 align-middle ${
                            NO_WRAP_COLS.includes(col.label)
                              ? "whitespace-nowrap"
                              : "whitespace-normal break-words"
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}

                      {allSectionSizes.length > 0 && (
                        <th
                          colSpan={allSectionSizes.length}
                          /*
                           * FIX: sticky + top:0 freezes this group header row
                           * vertically. z-20 sits below the corner fixed cells.
                           */
                          style={{ top: 0 }}
                          className="sticky z-20 text-center px-4 py-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider border-b border-b-indigo-200 border-l border-l-gray-200 bg-indigo-50/60"
                        >
                          A Section
                        </th>
                      )}

                      {allFrameSizes.length > 0 && (
                        <th
                          colSpan={allFrameSizes.length}
                          style={{ top: 0 }}
                          className="sticky z-20 text-center px-4 py-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider border-b border-b-emerald-200 border-l border-l-gray-200 bg-emerald-50/60"
                        >
                          Frame
                        </th>
                      )}
                    </tr>

                    {/* ── Row 2: size sub-headers ── */}
                    <tr className="bg-gray-50">
                      {allSectionSizes.map((size, i) => (
                        <th
                          key={size}
                          /*
                           * FIX: top offset equals row-1 height so this row sticks
                           * directly below row 1 during vertical scroll.
                           */
                          style={{ top: HEADER_ROW1_HEIGHT }}
                          className={`sticky z-20 px-3 py-2 text-center text-xs font-medium text-indigo-500 bg-indigo-50/40 border-b-2 border-b-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                            i === 0 ? "border-l border-l-gray-200" : "border-l border-l-gray-100"
                          }`}
                        >
                          {size}
                        </th>
                      ))}
                      {allFrameSizes.map((size, i) => (
                        <th
                          key={size}
                          style={{ top: HEADER_ROW1_HEIGHT }}
                          className={`sticky z-20 px-3 py-2 text-center text-xs font-medium text-emerald-500 bg-emerald-50/40 border-b-2 border-b-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                            i === 0 ? "border-l border-l-gray-200" : "border-l border-l-gray-100"
                          }`}
                        >
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {order_designs.map((design, index) => {
                      const sectionMap = Object.fromEntries(
                        design.a_sections.map((s) => [s.size, s.quantity])
                      );
                      const frameMap = Object.fromEntries(
                        design.frames.map((f) => [f.size, f.quantity])
                      );

                      const rowValues: (string | number)[] = [
                        index + 1,
                        design.design_code || "N/A",
                        design.design_type.short,
                        design.finishing.short,
                        design.panel_size.size,
                        design.nos ?? "0",
                      ];

                      const isEven = index % 2 === 0;
                      const rowBg = isEven ? "bg-white" : "bg-slate-100";
                      const stickyBg = isEven ? "bg-white" : "bg-slate-100";

                      return (
                        <tr
                          key={design.id}
                          className={`${rowBg} hover:bg-blue-50/50 transition-colors group`}
                        >
                          {/* ── Sticky fixed cells ── */}
                          {fixedColMeta.map((col, ci) => (
                            <td
                              key={col.label}
                              style={{ left: col.left }}
                              className={`sticky z-10 ${stickyBg} group-hover:bg-blue-50/50 px-4 py-3 border-r border-gray-100 border-b border-b-gray-100 transition-colors ${
                                ci === 0
                                  ? "text-gray-400 font-medium whitespace-nowrap"
                                  : ci === 1
                                  ? "font-semibold text-gray-800 whitespace-nowrap"
                                  : ci === 3
                                  ? "text-gray-700 whitespace-nowrap"
                                  : "text-gray-700 whitespace-normal break-words"
                              }`}
                            >
                              {rowValues[ci]}
                            </td>
                          ))}

                          {/* ── Scrollable: A Section quantity cells ── */}
                          {allSectionSizes.map((size, i) => (
                            <td
                              key={size}
                              className={`px-3 py-3 text-center border-b border-b-gray-100 ${
                                i === 0 ? "border-l border-gray-200" : "border-l border-gray-100"
                              }`}
                            >
                              {sectionMap[size] > 0 ? (
                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                                  {sectionMap[size]}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          ))}

                          {/* ── Scrollable: Frame quantity cells ── */}
                          {allFrameSizes.map((size, i) => (
                            <td
                              key={size}
                              className={`px-3 py-3 text-center border-b border-b-gray-100 ${
                                i === 0 ? "border-l border-gray-200" : "border-l border-gray-100"
                              }`}
                            >
                              {frameMap[size] > 0 ? (
                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs">
                                  {frameMap[size]}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

      {/* Blob Animations + Custom Scrollbar */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Custom thin scrollbar */
        .overflow-auto::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        /* Firefox */
        .overflow-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        /* Smooth touch scrolling on tablets */
        .touch-pan-x {
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x pan-y;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
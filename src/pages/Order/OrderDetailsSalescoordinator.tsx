import React, { useState, useEffect } from "react";

// Mock Icons (replace lucide-react)
const ChevronLeft = ({ size = 20, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const Package = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const User = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MapPin = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const Calendar = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Truck = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const CheckCircle = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircle = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const Loader = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const Check = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AlertCircle = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const FileText = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const Clock = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Split = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l5.1 5.1M4 4l5 5"></path>
  </svg>
);

// Types remain the same as in original file
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
  a_section_size: any;
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
  frame_size: any;
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
  panel_size: any;
  finishing_id: number;
  nos: number;
  created_at: string;
  updated_at: string;
  design_code: string;
  a_sections: ASection[];
  frames: FrameItem[];
  design_type: any;
  finishing: any;
  design: Design;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  state_id: number;
  state: any;
  district_id: number;
  district: any;
  location_id: number;
  location: any;
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

const OrderDetailsSalescoordinator: React.FC = () => {
  // Mock data for demonstration
  const id = "123";
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [splitMode, setSplitMode] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([]);
  const [splitting, setSplitting] = useState(false);

  // Mock API call
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: OrderData = {
        order: {
          id: 123,
          code: "ORD-2024-001",
          person_type: "customer",
          person_id: 1,
          customer_id: 1,
          delivery_date: "2024-12-31",
          status: "processing",
          created_at: "2024-11-15T10:30:00Z",
          updated_at: "2024-11-15T10:30:00Z",
        },
        customer: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone_no: "+91 9876543210",
          state_id: 1,
          state: { id: 1, name: "Kerala" },
          district_id: 1,
          district: { id: 1, name: "Ernakulam" },
          location_id: 1,
          location: { id: 1, location_name: "Kanayannur" },
          brand_id: 1,
          status: 1,
          full_location: "Kanayannur, Ernakulam, Kerala",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          created_by_type: "admin",
          created_by_id: 1,
          created_by_type_label: "Admin",
        },
        order_designs: [
          {
            id: 1,
            order_id: 123,
            design_id: 101,
            design_type_id: 1,
            panel_size_id: 1,
            panel_size: { id: 1, size: "8x4" },
            finishing_id: 1,
            nos: 5,
            created_at: "2024-11-15T10:30:00Z",
            updated_at: "2024-11-15T10:30:00Z",
            design_code: "DES-001",
            a_sections: [
              {
                id: 1,
                order_id: 123,
                order_design_id: 1,
                a_section_id: 1,
                quantity: 2,
                created_at: "2024-11-15T10:30:00Z",
                updated_at: "2024-11-15T10:30:00Z",
                size: "Small",
                a_section_size: {},
              },
            ],
            frames: [
              {
                id: 1,
                order_id: 123,
                order_design_id: 1,
                frame_id: 1,
                quantity: 4,
                created_at: "2024-11-15T10:30:00Z",
                updated_at: "2024-11-15T10:30:00Z",
                size: "Medium",
                frame_size: {},
              },
            ],
            design_type: { id: 1, title: "Standard" },
            finishing: { id: 1, title: "Glossy" },
            design: {
              id: 101,
              design_number: "DN-001",
              design_type_id: 1,
              design_type_short: "STD",
              panel_color_id: 1,
              a_section_color_id: 1,
              frame_color_id: 1,
              image: null,
              image_name: null,
              design_code: "DES-001",
              status: 1,
              deleted_at: null,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          },
          {
            id: 2,
            order_id: 123,
            design_id: 102,
            design_type_id: 2,
            panel_size_id: 2,
            panel_size: { id: 2, size: "10x4" },
            finishing_id: 2,
            nos: 3,
            created_at: "2024-11-15T10:30:00Z",
            updated_at: "2024-11-15T10:30:00Z",
            design_code: "DES-002",
            a_sections: [
              {
                id: 2,
                order_id: 123,
                order_design_id: 2,
                a_section_id: 2,
                quantity: 3,
                created_at: "2024-11-15T10:30:00Z",
                updated_at: "2024-11-15T10:30:00Z",
                size: "Large",
                a_section_size: {},
              },
            ],
            frames: [
              {
                id: 2,
                order_id: 123,
                order_design_id: 2,
                frame_id: 2,
                quantity: 6,
                created_at: "2024-11-15T10:30:00Z",
                updated_at: "2024-11-15T10:30:00Z",
                size: "Large",
                frame_size: {},
              },
            ],
            design_type: { id: 2, title: "Premium" },
            finishing: { id: 2, title: "Matte" },
            design: {
              id: 102,
              design_number: "DN-002",
              design_type_id: 2,
              design_type_short: "PRM",
              panel_color_id: 2,
              a_section_color_id: 2,
              frame_color_id: 2,
              image: null,
              image_name: null,
              design_code: "DES-002",
              status: 1,
              deleted_at: null,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          },
        ],
      };
      
      setOrderData(mockData);
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleToggleSplitMode = () => {
    setSplitMode(!splitMode);
    setSelectedDesigns([]);
  };

  const handleDesignSelection = (designId: number) => {
    setSelectedDesigns(prev => {
      if (prev.includes(designId)) {
        return prev.filter(id => id !== designId);
      } else {
        return [...prev, designId];
      }
    });
  };

  const handleSplitOrder = async () => {
    if (selectedDesigns.length === 0) {
      alert("Please select at least one design to split");
      return;
    }

    if (orderData && selectedDesigns.length === orderData.order_designs.length) {
      alert("Cannot split all designs. At least one design must remain in the original order");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to split ${selectedDesigns.length} design(s) into a new order?`
    );

    if (confirmed) {
      try {
        setSplitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock API response
        console.log("Splitting order with design IDs:", selectedDesigns);
        
        alert(`Order split successfully! New order created with ${selectedDesigns.length} design(s)`);
        
        // Refresh data
        fetchOrderDetails();
        setSplitMode(false);
        setSelectedDesigns([]);
      } catch (error: any) {
        console.error("Failed to split order:", error);
        alert("Failed to split order. Please try again.");
      } finally {
        setSplitting(false);
      }
    }
  };

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

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => alert("Navigate back to orders list")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ChevronLeft size={16} className="w-4 h-4" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const { order, customer, order_designs } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => alert("Navigate back to orders list")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-lg text-gray-600">Order #{order.code}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>

              {order_designs.length > 1 && (
                <button
                  onClick={handleToggleSplitMode}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    splitMode
                      ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                  }`}
                >
                  <Split className="w-4 h-4" />
                  {splitMode ? "Cancel Split" : "Split Order"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                  <p className="font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.phone_no}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{customer.location.location_name}</p>
                  <p className="text-xs text-gray-500">{customer.district.name},{customer.state.name}</p>
                </div>
              </div>

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

        {splitMode && selectedDesigns.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedDesigns.length} design(s) selected
                </p>
                <p className="text-sm text-gray-600">
                  These designs will be moved to a new order
                </p>
              </div>
            </div>
            <button
              onClick={handleSplitOrder}
              disabled={splitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {splitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Splitting...
                </>
              ) : (
                <>
                  <Split className="w-4 h-4" />
                  Confirm Split
                </>
              )}
            </button>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 overflow-hidden">
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
              <div className="space-y-4">
                {order_designs.map((design, index) => (
                  <div
                    key={design.id}
                    className={`bg-white rounded-lg shadow-md border-2 p-3 transition-all ${
                      splitMode && selectedDesigns.includes(design.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        {splitMode && (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDesigns.includes(design.id)}
                              onChange={() => handleDesignSelection(design.id)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </label>
                        )}
                        <div className="p-1 bg-blue-50 rounded">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <h2 className="text-base font-semibold text-gray-800">
                          Design Details - {index + 1}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-3">
                        <div className="bg-gray-50 rounded p-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">Design Type</div>
                          <div className="text-sm font-semibold text-gray-800">
                            {design.design_type.title}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">Finishing</div>
                          <div className="text-sm font-semibold text-gray-800">
                            {design.finishing.title}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">Panel Size</div>
                          <div className="text-sm font-semibold text-gray-800">
                            {design.panel_size.size}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">Panel Nos</div>
                          <div className="text-sm font-semibold text-gray-800">
                            {design.nos || "0"}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5">
                          <div className="text-xs text-gray-500 mb-0.5">Design No</div>
                          <div className="text-sm font-semibold text-gray-800">
                            {design.design_code || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-transparent rounded p-2">
                        <div className="flex items-center gap-4">
                          <div className="text-xs font-semibold text-gray-700 min-w-[70px]">
                            A Section:
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            {design.a_sections.map((section) => (
                              <div
                                key={section.id}
                                className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm"
                              >
                                <span className="text-xs text-gray-500">{section.size}</span>
                                <span className="text-sm font-bold text-gray-800">
                                  {section.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-transparent rounded p-2">
                        <div className="flex items-center gap-4">
                          <div className="text-xs font-semibold text-gray-700 min-w-[70px]">
                            Frame:
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            {design.frames.map((frame) => (
                              <div
                                key={frame.id}
                                className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm"
                              >
                                <span className="text-xs text-gray-500">{frame.size}</span>
                                <span className="text-sm font-bold text-gray-800">
                                  {frame.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default OrderDetailsSalescoordinator;
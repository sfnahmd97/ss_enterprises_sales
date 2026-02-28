import { Pencil, MapPin, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  orders: any[];
  loading: boolean;
  currentPage: number;
  perPage: number;
  updateOrderStatus: (id: number, assignStatus: string) => void;
}

export default function SalesManagerOrders({
  orders,
  loading,
  currentPage,
  perPage,
  updateOrderStatus,
}: Props) {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    const base = "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ";
    switch (status?.toLowerCase()) {
      case "confirmed": return base + "bg-cyan-50 text-cyan-600 border border-cyan-100";
      case "delivered": return base + "bg-green-50 text-green-600 border border-green-100";
      case "cancelled": return base + "bg-red-50 text-red-600 border border-red-100";
      default: return base + "bg-yellow-50 text-yellow-600 border border-yellow-100";
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full">
      {/* MOBILE & TABLET LIST VIEW (Visible on small/medium screens) */}
      <div className="lg:hidden">
        {orders.map((val) => (
          <div 
            key={val.id} 
            onClick={() => navigate(`/orders/details/${val.id}`)}
            className="p-4 border-b border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-gray-900">{val.code}</span>
              <span className={getStatusStyle(val.status)}>{val.status}</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <p className="text-sm font-medium text-gray-700">{val.customer.name}</p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1" /> {val.customer.full_location}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={12} className="mr-1" /> {new Date(val.delivery_date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-50" onClick={e => e.stopPropagation()}>
               <Link to={`/orders/edit/${val.id}`} className="p-2 bg-gray-100 rounded-lg text-gray-600"><Pencil size={16}/></Link>
               {val.assign_status === "not_assigned" ? (
                 <button onClick={() => updateOrderStatus(val.id, "sales_coordinator")} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">Assign</button>
               ) : <span className="text-xs text-gray-400">{val.assign_label}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on large screens) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfc] border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">#</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order Code</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Delivery Date</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Person</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((val, index) => (
              <tr 
                key={val.id} 
                onClick={() => navigate(`/orders/details/${val.id}`)}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-5 text-xs text-gray-500 text-center">{(currentPage - 1) * perPage + (index + 1)}</td>
                <td className="px-6 py-5 text-xs font-bold text-gray-700">{val.code}</td>
                <td className="px-6 py-5 text-xs font-bold text-gray-800 leading-relaxed max-w-[150px]">{val.customer.name}</td>
                <td className="px-6 py-5 text-[11px] text-gray-500 max-w-[200px] truncate">{val.customer.full_location}</td>
                <td className="px-6 py-5 text-xs text-gray-600 text-center font-medium">
                  {new Date(val.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-5 text-xs font-bold text-gray-700">{val.person.name}</td>
                <td className="px-6 py-5 text-center">
                  <span className={getStatusStyle(val.status)}>{val.status}</span>
                </td>
                <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-3">
                    <Link to={`/orders/edit/${val.id}`} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-blue-600 hover:text-white transition">
                      <Pencil size={14} />
                    </Link>
                    {val.assign_status === "not_assigned" ? (
                      <button 
                        onClick={() => updateOrderStatus(val.id, "sales_coordinator")}
                        className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 shadow-sm font-semibold"
                      >
                        Assign
                      </button>
                    ) : <span className="text-[10px] text-gray-400 font-bold uppercase">{val.assign_label}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
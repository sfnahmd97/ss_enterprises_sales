import { useNavigate} from "react-router-dom";


interface Props {
  orders: any[];
  loading: any;
  currentPage: any;
  perPage: any;
}

export default function DefaultOrders({
  orders,
  loading,
  currentPage,
  perPage,
}: Props) {

  const navigate = useNavigate();

  return (
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
                      {/* <td className="px-6 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                        to={`/orders/details/${val.id}`}
                        className="inline-flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                        title="Edit"
                      >
                        <Eye size={16} />
                      </Link>
                      </td> */}
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
  );
}

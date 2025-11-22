import { User, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";

export default function SalesCustomers({
  customers,
  loading,
  currentPage,
  perPage,
  onSelect,
}: {
  customers: any[];
  loading: boolean;
  currentPage: number;
  perPage: number;
  onSelect: (id: number) => void;
}) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
                </td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((val, index) => (
                <tr
                  key={val.id}
                  onClick={() => onSelect(val.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {(currentPage - 1) * perPage + (index + 1)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{val.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{val.phone_no ?? "N/A"}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {val.location.location_name}, {val.district.name}, {val.state.name}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        val.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {val.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {new Date(val.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No customers found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-500">Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {customers.map((val, index) => (
              <div
                key={val.id}
                onClick={() => onSelect(val.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{val.name}</h3>
                      <p className="text-xs text-gray-500">
                        #{(currentPage - 1) * perPage + (index + 1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        val.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {val.status ? "Active" : "Inactive"}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{val.phone_no ?? "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {val.location.location_name}, {val.district.name}, {val.state.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(val.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </>
  );
}

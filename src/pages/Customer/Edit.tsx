import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MasterForm from "./MasterForm";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import type { FormikHelpers } from "formik";
import type { Customer } from "../../interfaces/common";
import PageLoader from "../../components/common/pageLoader";
import { ChevronLeft } from "lucide-react";

export default function editCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/sales/get-customer-details/${id}`);
        const data = (res.data as { data: any }).data;

        setInitialValues({
          ...data,
          status: data.status === 1,
          state_id: Number(data.state_id),
          district_id: Number(data.district_id),
          location_id: Number(data.location_id),
        });
      } catch (err) {
        toast.error("Failed to load Customer data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCustomer();
  }, [id]);

  const handleSubmit = async (
    values: Customer,
    { setErrors }: FormikHelpers<Customer>
  ) => {
    try {
      const res = await api.put(`/sales/update-customer/${id}`, values);
      const success = (res.data as { success: any[] }).success;
      const message = (res.data as { message: string }).message;
      if (success) {
        toast.success(message);
        navigate("/customers/list");
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const formattedErrors: Record<string, string> = {};

        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field][0];
        });

        setErrors(formattedErrors);
      } else {
        toast.error(error.response?.data?.message || "Server error");
      }
    }
  };

  if (loading) return <PageLoader />;
  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <Link
          to="/customers/list"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          title="Go to Dashboard"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span>Customers</span>
        </Link>
      </div>
      <MasterForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}

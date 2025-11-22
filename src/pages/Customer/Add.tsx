import MasterForm from "./MasterForm";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import type { FormikHelpers } from "formik";
import type { Customer } from "../../interfaces/common";
import { ChevronLeft } from "lucide-react";

export default function addCustomer() {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: Customer,
    { setErrors }: FormikHelpers<Customer>
  ) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = (values as any)[key];

         if (key === "status") {
          formData.append("status", value ? "1" : "0");
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await api.post("sales/create-customer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        initialValues={{
          name: "",
          phone_no: "",
          email: "",
          state_id: "",
          district_id: "",
          location_id: "",
          brand_id: "",
          status: true,
        }}
        onSubmit={handleSubmit}
        mode="create"
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { ChevronLeft, User, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import CustomerDetails from "./Components/CustomerDetails";
import { useNavigate } from "react-router-dom";

import type {
  DoorPartSize,
  Finishing,
  OrderForm,
  DesignType,
  DesignCode,
} from "../../interfaces/common";
import PageLoader from "../../components/common/pageLoader";
import DesignPreviewCard from "./Components/DesignPreviewCard";
import DesignDetails from "./Components/DesginDetails";

export default function OrderForm() {

  const navigate = useNavigate();
  type SelectOption = {
    value: string | number;
    label: string;
  };

  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [designTypes, setDesignTypes] = useState<DesignType[]>([]);
  const [finishings, setFinishing] = useState<Finishing[]>([]);
  const [panelSizes, setPanelSizes] = useState<DoorPartSize[]>([]);
  const [aSectionSizes, setASectionSizes] = useState<DoorPartSize[]>([]);
  const [frameSizes, setFrameSizes] = useState<DoorPartSize[]>([]);
  const [designCodes, setDesignCodes] = useState<DesignCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDesignTypes = async () => {
    try {
      const res = await api.get("sales/get-design-types");
      const data = (res.data as { data: any }).data;
      setDesignTypes(data);
    } catch (error) {
      console.error("Failed to load design types", error);
    }
  };

  const fetchFinishing = async () => {
    try {
      const res = await api.get("sales/get-finishing");
      const data = (res.data as { data: any }).data;

      setFinishing(data);
    } catch (error) {
      console.error("Failed to load finishing", error);
    }
  };

  const fetchPanelSizes = async () => {
    try {
      const res = await api.get("sales/get-door-part-sizes/panel");
      const data = (res.data as { data: any }).data;
      setPanelSizes(data);
    } catch (error) {
      console.error("Failed to load Panel Sizes", error);
    }
  };

  const fetchASectionSizes = async () => {
    try {
      const res = await api.get("sales/get-door-part-sizes/a_section");
      const data = (res.data as { data: any }).data;
      setASectionSizes(data);
    } catch (error) {
      console.error("Failed to load A Section Sizes", error);
    }
  };

  const fetchFrameSizes = async () => {
    try {
      const res = await api.get("sales/get-door-part-sizes/frame");
      const data = (res.data as { data: any }).data;
      setFrameSizes(data);
    } catch (error) {
      console.error("Failed to load Frame Sizes", error);
    }
  };

  const fetchDesignCodes = async (
    designTypeID?: string,
    finishingID?: string
  ) => {
    try {
      const url = `sales/get-designs/${designTypeID || ""}/${
        finishingID || ""
      }`;
      const res = await api.get(url);
      const data = (res.data as { data: any[] }).data;
      setDesignCodes(data);
    } catch (error) {
      console.error("Failed to load designs", error);
      setDesignCodes([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("sales/get-customers");
      const data = (res.data as { data: any }).data;

      const formattedCustomers = data.map((customer: any) => ({
        value: customer.id,
        label: customer.name,
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error("Failed to load Customers", error);
    }
  };

  const getDesignTypeTitle = (id: string | number) =>
    designTypes.find((dt) => dt.id === Number(id))?.title || "N/A";

  const getFinishingTitle = (id: string | number) =>
    finishings.find((f) => f.id === Number(id))?.title || "N/A";

  const getPanelSize = (id: string | number) =>
    panelSizes.find((p) => p.id === Number(id))?.size || "N/A";

  const getDesignCodeTitle = (id: string | number) =>
    designCodes.find((dc) => dc.id === Number(id))?.design_code || "N/A";

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchCustomers(),
          fetchDesignTypes(),
          fetchFinishing(),
          fetchPanelSizes(),
          fetchASectionSizes(),
          fetchFrameSizes(),
        ]);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false); // hide loader once all data fetched
      }
    };

    loadAllData();
  }, []);

  const [formData, setFormData] = useState({
    customerName: "",
    place: "",
    brand: "",
    deliveryDate: "",
  });

  const [currentDesign, setCurrentDesign] = useState<OrderForm>({
    id: 0,
    designType: "",
    panelSize: "",
    designNo: "",
    finishing: "",
    nos: "",
    aSection: {},
    frame: {},
  });

  interface Errors {
    designType?: boolean;
    designNo?: boolean;
    finishing?: boolean;
    panelSize?: boolean;
    size?: boolean;
    nos?: boolean;
  }

  const [savedDesigns, setSavedDesigns] = useState<OrderForm[]>([]);

  const [errors, setErrors] = useState<Errors>({});
  const [customerErrors, setCustomerErrors] = useState({
  customerName: false,
  deliveryDate: false,
});

  const handleAddDesign = () => {
    const newErrors: any = {};

    if (!currentDesign.designType) newErrors.designType = true;
    if (!currentDesign.designNo) newErrors.designNo = true;
    if (!currentDesign.panelSize) newErrors.panelSize = true;
    if (!currentDesign.finishing) newErrors.finishing = true;
    if (!currentDesign.nos) newErrors.nos = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields!");
      return;
    }

    // ✅ Save current design
    const newDesign = { ...currentDesign, id: savedDesigns.length + 1 };
    setSavedDesigns([...savedDesigns, newDesign]);

    // ✅ Keep last selected type, finishing, size, design no
    // 🔁 Reset only the specified fields
    setCurrentDesign({
      ...currentDesign,
      id: 0,
      nos: "",
      aSection: {},
      frame: {},
    });

    // ✅ Clear validation errors
    setErrors({});
  };

  const handleSubmit = async ({ resetForm }: any) => {
  const { customerName, deliveryDate } = formData;

  if (!customerName || !deliveryDate) {
  setCustomerErrors({
    customerName: !customerName,
    deliveryDate: !deliveryDate,
  });
  toast.error("Please fill in all customer details!");
  return;
}

 if (savedDesigns.length === 0) {
    toast.error("Please add at least one design before submitting!");
    return;
  }

    console.log("Form submitted:", { formData, savedDesigns });
    const submissionData = {
    ...formData,
    designs: savedDesigns,
  };

    try {
          const res = await api.post("/sales/order/create", submissionData);
    
          const success = (res.data as { success: any[] }).success;
          const message = (res.data as { message: string }).message;
    
          if (success) {
            toast.success(message);
            resetForm();
            navigate("/profile/change-password");
          } else {
            toast.error("Something went wrong");
          }
        } catch (error: any) {
          if (error.response?.data?.errors) {
            const formatted: any = {};
            Object.keys(error.response.data.errors).forEach(
              (f) => (formatted[f] = error.response.data.errors[f][0])
            );
            setErrors(formatted);
          } else toast.error("Server error");
        }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 transition-opacity duration-500 ${
        loading ? "opacity-0" : "opacity-100"
      } p-4 md:p-6 lg:p-8`}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center mb-6">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          title="Go to Dashboard"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span>Dashboard</span>
        </Link>
      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* 1. Customer Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Order Form</h2>
          </div>

{/* Customer Form */}
          <CustomerDetails
            customers={customers}
            formData={formData}
            customerErrors={customerErrors}
            setFormData={setFormData}
          />
        </div>

        {/* 2. Design Details Input Section */}
        <DesignDetails
            savedDesigns={savedDesigns}
            designTypes={designTypes}
            currentDesign={currentDesign}
            setCurrentDesign={setCurrentDesign}
            fetchDesignCodes={fetchDesignCodes}
            setErrors={setErrors}
            errors={errors}
            finishings={finishings}
            designCodes={designCodes}
            panelSizes={panelSizes}
            aSectionSizes={aSectionSizes}
            frameSizes={frameSizes}
            handleAddDesign={handleAddDesign}
          />

        {/* Saved Designs Display Section (Dynamic View) */}
        {savedDesigns.map((design) => (
          <DesignPreviewCard
            key={design.id}
            design={design}
            getDesignTypeTitle={getDesignTypeTitle}
            getFinishingTitle={getFinishingTitle}
            getDesignCodeTitle={getDesignCodeTitle}
            getPanelSize={getPanelSize}
            aSectionSizes={aSectionSizes}
            frameSizes={frameSizes}
          />
        ))}

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-10 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

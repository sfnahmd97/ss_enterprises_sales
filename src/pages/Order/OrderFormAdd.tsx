// src/pages/Orders/OrderFormAdd.tsx
import { useState } from "react";
import { ChevronLeft, User, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import CustomerDetails from "./Components/CustomerDetails";
import DesignPreviewCard from "./Components/DesignPreviewCard";
import DesignDetails from "./Components/DesginDetails";

import type {
  DoorPartSize,
  OrderForm,
  SelectOption,
} from "../../interfaces/common";
import { confirmAlert } from "../../lib/alertUtils";

interface Props {
  customers: SelectOption[];
  designTypes: SelectOption[];
  finishings: SelectOption[];
  panelSizes: SelectOption[];
  aSectionSizes: DoorPartSize[];
  frameSizes: DoorPartSize[];

  getDesignTypeTitle: (id: string | number) => string;
  getFinishingTitle: (id: string | number) => string;
  getPanelSize: (id: string | number) => string;
}

interface Errors {
  designType?: boolean;
  designNo?: boolean;
  finishing?: boolean;
  panelSize?: boolean;
  size?: boolean;
  nos?: boolean;
}

export default function OrderFormAdd({
  customers,
  designTypes,
  finishings,
  panelSizes,
  aSectionSizes,
  frameSizes,
  getDesignTypeTitle,
  getFinishingTitle,
  getPanelSize,
}: Props) {
  const navigate = useNavigate();

  const [designCodes, setDesignCodes] = useState<SelectOption[]>([]);
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

  const [savedDesigns, setSavedDesigns] = useState<OrderForm[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [customerErrors, setCustomerErrors] = useState({
    customerName: false,
    deliveryDate: false,
  });

  const fetchDesignCodes = async (
    designTypeID?: string,
    finishingID?: string
  ) => {
    try {
      const url = `sales/get-designs/${designTypeID || ""}/${finishingID || ""}`;
      const res = await api.get(url);
      const data = (res.data as { data: any[] }).data;

      const formattedData = data.map((design: any) => ({
        value: design.id,
        label: design.design_code,
      }));

      setDesignCodes(formattedData);
    } catch (error) {
      console.error("Failed to load designs", error);
      setDesignCodes([]);
    }
  };

  const getDesignCodeTitle = (id: string | number) =>
    designCodes.find((dc) => dc.value === Number(id))?.label || "N/A";

  const handleAddDesign = () => {
    const newErrors: any = {};

    if (!currentDesign.designType) newErrors.designType = true;
    if (!currentDesign.designNo) newErrors.designNo = true;
    if (!currentDesign.panelSize) newErrors.panelSize = true;
    if (!currentDesign.finishing) newErrors.finishing = true;
    // if (!currentDesign.nos) newErrors.nos = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields!");
      return;
    }

     const isDuplicate = savedDesigns.some((d) =>
    Number(d.designType) === Number(currentDesign.designType) &&
    Number(d.finishing) === Number(currentDesign.finishing) &&
    Number(d.panelSize) === Number(currentDesign.panelSize) &&
    Number(d.designNo) === Number(currentDesign.designNo)
  );

  if (isDuplicate) {
    toast.error("This design combination is already added!");
    return;
  }


    const newDesign = { ...currentDesign, id: savedDesigns.length + 1 };
    setSavedDesigns((prev) => [...prev, newDesign]);

    setCurrentDesign({
      ...currentDesign,
      id: 0,
      nos: "",
      aSection: {},
      frame: {},
    });

    toast.success("Design Added.");
    setErrors({});
  };

  const updateDesign = (designId: number, updatedData: OrderForm) => {
    setSavedDesigns((prev) =>
      prev.map((d) => (d.id === designId ? { ...updatedData, id: designId } : d))
    );
    toast.success("Design Updated!");
  };

  const removeDesign = (id: number) => {
    confirmAlert(
      "You want to remove this design!",
      async () => {
        setSavedDesigns((prev) => prev.filter((design) => design.id !== id));
        toast.success("Design removed");
      },
      () => console.log("Remove cancelled")
    );
  };

  const handleSubmit = async () => {
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

    const submissionData = {
      ...formData,
      designs: savedDesigns,
    };

    try {
      const res = await api.post("/sales/order/create", submissionData);

      const success = (res.data as { success: boolean }).success;
      const message = (res.data as { message: string }).message;

      if (success) {
        const data = (res.data as { data: any }).data;
        const orderId = data.id;

        toast.success(message);

        setFormData({
          customerName: "",
          place: "",
          brand: "",
          deliveryDate: "",
        });

        setSavedDesigns([]);
        setCurrentDesign({
          id: 0,
          designType: "",
          panelSize: "",
          designNo: "",
          finishing: "",
          nos: "",
          aSection: {},
          frame: {},
        });

        setErrors({});
        navigate("/orders/details/" + orderId);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      console.log("error: " + error);
      if (error.response?.data?.errors) {
        const formatted: any = {};
        Object.keys(error.response.data.errors).forEach(
          (f) => (formatted[f] = error.response.data.errors[f][0])
        );
        setErrors(formatted);
      } else toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
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
        {/* Customer Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Order Form - Create</h2>
          </div>

          <CustomerDetails
            customers={customers}
            formData={formData}
            customerErrors={customerErrors}
            setFormData={setFormData}
          />
        </div>

        {/* Design Input Section */}
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

        {/* Saved Designs Preview */}
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
            designTypes={designTypes}
            finishings={finishings}
            panelSizes={panelSizes}
            designCodes={designCodes}
            fetchDesignCodes={fetchDesignCodes}
            updateDesign={updateDesign}
            removeDesign={removeDesign}
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

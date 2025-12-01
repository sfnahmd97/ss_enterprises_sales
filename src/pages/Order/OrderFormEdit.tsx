// src/pages/Orders/OrderFormEdit.tsx
import { useEffect, useState } from "react";
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
import PageLoader from "../../components/common/pageLoader";

interface Props {
  orderId: number;

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

export default function OrderFormEdit({
  orderId,
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
    customerId: "",
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
    customerId: false,
    deliveryDate: false,
  });
  const [loading, setLoading] = useState(true);

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

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/sales/order/get-order-details/${orderId}`);
      const payload = (res.data as any).data;
      const order = payload.order;
      const customer = payload.customer;
      const orderDesigns = payload.order_designs as any[];

      // Prefill customer data
      setFormData({
        customerId: order.customer_id || "",
        place: customer?.full_location || "",
        brand: customer?.brand?.name || "", 
        deliveryDate: order.delivery_date || "",
      });

      const initialDesignCodes: SelectOption[] = orderDesigns.map((od) => ({
        value: od.design.id,
        label: od.design.design_code,
      }));
      setDesignCodes(initialDesignCodes);

      const mappedDesigns: OrderForm[] = orderDesigns.map(
        (od: any, index: number) => {
          const aSectionMap: Record<number, number> = {};
          (od.a_sections || []).forEach((sec: any) => {
            aSectionMap[sec.a_section_id] = sec.quantity;
          });

          const frameMap: Record<number, number> = {};
          (od.frames || []).forEach((fr: any) => {
            frameMap[fr.frame_id] = fr.quantity;
          });

          return {
            id: index + 1,
            designType: od.design_type_id,
            panelSize: od.panel_size_id,
            designNo: od.design_id,
            finishing: od.finishing_id,
            nos: od.nos,
            aSection: aSectionMap,
            frame: frameMap,
          };
        }
      );

      setSavedDesigns(mappedDesigns);
    } catch (error) {
      console.error("Failed to fetch order details", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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
    const { customerId, deliveryDate } = formData;

    if (!customerId || !deliveryDate) {
      setCustomerErrors({
        customerId: !customerId,
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
      const res = await api.put(`/sales/order/update/${orderId}`, submissionData);

      const success = (res.data as { success: boolean }).success;
      const message = (res.data as { message: string }).message;

      if (success) {
        toast.success(message || "Order updated successfully");
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

  if (loading) return <PageLoader />;

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
            <h2 className="text-lg font-semibold">Order Form - Edit</h2>
          </div>

          <CustomerDetails
            customers={customers}
            formData={formData}
            customerErrors={customerErrors}
            setFormData={setFormData}
          />
        </div>

        {/* Design Input Section (for adding extra designs if needed) */}
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

        {/* Existing Designs Preview with inline edit/remove */}
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
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

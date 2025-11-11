import { useEffect, useState } from "react";
import { ChevronLeft, User, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Select from "react-select";
import api from "../../lib/axios";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import CustomerDetails from "./Components/CustomerDetails";

import type {
  DoorPartSize,
  Finishing,
  OrderForm,
  DesignType,
} from "../../interfaces/common";
import PageLoader from "../../components/common/pageLoader";
import DesignPreviewCard from "./Components/DesignPreviewCard";

export default function OrderForm() {
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
  const [designCodes, setDesignCodes] = useState<
    { id: number; design_code: string }[]
  >([]);
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
    panel: "",
    size: "",
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
      panel: "",
      size: "",
      nos: "",
      aSection: {},
      frame: {},
    });

    // ✅ Clear validation errors
    setErrors({});
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { formData, savedDesigns });
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
            setFormData={setFormData}
          />
        </div>

        {/* 2. Design Details Input Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Design Details - SL - 0{savedDesigns.length + 1}
            </h2>
          </div>

          {/* Design Type, Design No, Finishing */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* ✅ DESIGN TYPE */}
            <div className="relative">
              <Select
                options={designTypes.map((dt) => ({
                  value: String(dt.id ?? ""),
                  label: dt.title,
                }))}
                value={
                  currentDesign.designType
                    ? {
                        value: currentDesign.designType,
                        label:
                          designTypes.find(
                            (dt) =>
                              String(dt.id ?? "") === currentDesign.designType
                          )?.title || "",
                      }
                    : null
                }
                onChange={(option) => {
                  const value = option ? option.value.toString() : "";
                  setCurrentDesign({ ...currentDesign, designType: value });
                  setErrors({ ...errors, designType: false });
                  fetchDesignCodes(value, currentDesign.finishing);
                }}
                placeholder="Select Type"
                isClearable
                className="w-full"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "46px",
                    height: "46px",
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 0.5rem",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "46px",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.designType ? "text-red-500" : "text-gray-600"
                }`}
              >
                Design Type{" "}
                {errors.designType && <span className="text-red-500">*</span>}
              </label>
            </div>

            {/* ✅ FINISHING */}
            <div className="relative">
              <Select
                options={finishings.map((f) => ({
                  value: String(f.id ?? ""),
                  label: f.title,
                }))}
                value={
                  currentDesign.finishing
                    ? {
                        value: currentDesign.finishing,
                        label:
                          finishings.find(
                            (f) =>
                              String(f.id ?? "") === currentDesign.finishing
                          )?.title || "",
                      }
                    : null
                }
                onChange={(option) => {
                  const value = option ? option.value.toString() : "";
                  setCurrentDesign({ ...currentDesign, finishing: value });
                  setErrors({ ...errors, finishing: false });
                  fetchDesignCodes(currentDesign.designType, value);
                }}
                placeholder="Select Finishing"
                isClearable
                className="w-full"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "46px",
                    height: "46px",
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 0.5rem",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "46px",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.finishing ? "text-red-500" : "text-gray-600"
                }`}
              >
                Finishing{" "}
                {errors.finishing && <span className="text-red-500">*</span>}
              </label>
            </div>

            {/* ✅ PANEL SIZE */}
            <div className="relative">
              <Select
                options={panelSizes.map((p) => ({
                  value: String(p.id ?? ""),
                  label: p.size,
                }))}
                value={
                  currentDesign.panelSize
                    ? {
                        value: currentDesign.panelSize,
                        label:
                          panelSizes.find(
                            (p) =>
                              String(p.id ?? "") === currentDesign.panelSize
                          )?.size || "",
                      }
                    : null
                }
                onChange={(option) => {
                  const value = option ? option.value.toString() : "";
                  setCurrentDesign({ ...currentDesign, panelSize: value });
                  setErrors({ ...errors, panelSize: false });
                }}
                placeholder="Select Panel Size"
                isClearable
                className="w-full"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "46px",
                    height: "46px",
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 0.5rem",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "46px",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.panelSize ? "text-red-500" : "text-gray-600"
                }`}
              >
                Panel Size{" "}
                {errors.panelSize && <span className="text-red-500">*</span>}
              </label>
            </div>

            {/* ✅ DESIGN NO */}
            <div className="relative">
              <Select
                options={designCodes.map((d) => ({
                  value: d.design_code,
                  label: d.design_code,
                }))}
                value={
                  currentDesign.designNo
                    ? {
                        value: currentDesign.designNo,
                        label: currentDesign.designNo,
                      }
                    : null
                }
                onChange={(option) => {
                  const value = option ? option.value.toString() : "";
                  setCurrentDesign({ ...currentDesign, designNo: value });
                  setErrors({ ...errors, designNo: false });
                }}
                placeholder="Select Design"
                isClearable
                className="w-full"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "46px",
                    height: "46px",
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 0.5rem",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "46px",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.designNo ? "text-red-500" : "text-gray-600"
                }`}
              >
                Design No.{" "}
                {errors.designNo && <span className="text-red-500">*</span>}
              </label>
            </div>
          </div>

          {/* Panel with Size and Nos */}
          <div className="mb-6">
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                {/* PANEL LABEL */}
                <label className="w-28 text-sm text-gray-600">Panel : </label>

                {/* SIZE + NOS IN A ROW */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={currentDesign.nos}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key))
                          e.preventDefault();
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData.getData("text");
                        if (/[^0-9]/.test(paste)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        setCurrentDesign({
                          ...currentDesign,
                          nos: e.target.value,
                        });
                        setErrors({ ...errors, nos: false });
                      }}
                      placeholder="0"
                      className={`w-full px-3 py-2 border ${
                        errors.nos ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <label
                      className={`absolute left-3 -top-2.5 bg-white px-1 text-xs ${
                        errors.nos ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      Nos{" "}
                      {errors.nos && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* A Section */}
          <div className="mb-6">
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                {/* A SECTION LABEL */}
                <label className="w-28 text-sm text-gray-600">
                  A section :
                </label>

                {/* FIELDS IN SAME ROW */}
                <div
                  className="grid gap-4 w-full"
                  style={{
                    gridTemplateColumns: `repeat(${aSectionSizes.length}, minmax(0, 1fr))`,
                  }}
                >
                  {aSectionSizes.map((val) => {
                    const id = Number(val.id); // ✅ ensures numeric key
                    return (
                      <div key={id} className="relative">
                        <input
                          type="number"
                          name={`a_section${id}`}
                          min={0}
                          step={1}
                          value={currentDesign.aSection[id] || ""}
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-", "."].includes(e.key))
                              e.preventDefault();
                          }}
                          onPaste={(e) => {
                            const paste = e.clipboardData.getData("text");
                            if (/[^0-9]/.test(paste)) e.preventDefault();
                          }}
                          onChange={(e) =>
                            setCurrentDesign((prev) => ({
                              ...prev,
                              aSection: {
                                ...prev.aSection,
                                [id]: e.target.value,
                              },
                            }))
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                          {val.size}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Frame */}
          <div className="mb-6">
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                {/* FRAME LABEL */}
                <label className="w-28 text-sm text-gray-600">Frame :</label>

                {/* FIELDS IN SAME ROW */}
                <div
                  className="grid gap-4 w-full"
                  style={{
                    gridTemplateColumns: `repeat(${frameSizes.length}, minmax(0, 1fr))`,
                  }}
                >
                  {frameSizes.map((val) => {
                    const id = Number(val.id);
                    return (
                      <div key={id} className="relative">
                        <input
                          type="number"
                          name={`frame${id}`}
                          min={0}
                          step={1}
                          value={currentDesign.frame[id] || ""}
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-", "."].includes(e.key))
                              e.preventDefault();
                          }}
                          onPaste={(e) => {
                            const paste = e.clipboardData.getData("text");
                            if (/[^0-9]/.test(paste)) e.preventDefault();
                          }}
                          onChange={(e) =>
                            setCurrentDesign((prev) => ({
                              ...prev,
                              frame: {
                                ...prev.frame,
                                [id]: e.target.value,
                              },
                            }))
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                          {val.size}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddDesign}
              className="bg-gray-900 text-white px-8 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Saved Designs Display Section (Dynamic View) */}
        {savedDesigns.map((design) => (
          <DesignPreviewCard
            key={design.id}
            design={design}
            getDesignTypeTitle={getDesignTypeTitle}
            getFinishingTitle={getFinishingTitle}
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

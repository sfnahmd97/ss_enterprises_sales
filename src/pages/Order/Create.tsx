import { useEffect, useState } from "react";
import { User, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Select from "react-select";
import api from "../../lib/axios";
import type {
  DoorPartSize,
  Finishing,
  OrderForm,
  DesignType,
} from "../../interfaces/common";

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
  const [designCodes, setDesignCodes] = useState<{ id: number; design_code: string }[]>(
    []
  );
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

  const fetchDesignCodes = async (designTypeID?: string, finishingID?: string) => {
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
  if (!currentDesign.finishing) newErrors.finishing = true;
  if (!currentDesign.nos) newErrors.nos = true;

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error(
      "Please fill in all required fields: Design Type, Design Number, Finishing, and Nos"
    );
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
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div
  className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 transition-opacity duration-500 ${
    loading ? "opacity-0" : "opacity-100"
  }`}
>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* 1. Customer Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Order Form</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <Select
  options={customers}
  value={
    customers.find((opt) => opt.label === formData.customerName) || null
  }
  onChange={(selectedOption) =>
    setFormData({
      ...formData,
      customerName: selectedOption ? selectedOption.label : "",
    })
  }
  placeholder="Select a Customer"
  isClearable
  className="w-full"
  styles={{
    control: (base) => ({
      ...base,
      padding: "0.375rem 0",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
  }}
/>

              <label
                htmlFor="customerName"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600"
              >
                Customer Name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="place"
                value={formData.place}
                onChange={(e) =>
                  setFormData({ ...formData, place: e.target.value })
                }
                placeholder="Enter the place"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer placeholder-transparent"
              />
              <label
                htmlFor="place"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Place / Dist
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Enter the Brand"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer placeholder-transparent"
              />
              <label
                htmlFor="brand"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Brand
              </label>
            </div>

            <div className="relative">
              <input
                type="date"
                id="deliveryDate"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="deliveryDate"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600"
              >
                Delivery Date
              </label>
            </div>
          </div>
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
            <div className="relative">
              <select
                value={currentDesign.designType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setCurrentDesign({
                    ...currentDesign,
                    designType: selectedType,
                  });
                  setErrors({ ...errors, designType: false });

                  // Fetch designs if finishing is already selected
                  if (selectedType || currentDesign.finishing) {
                    fetchDesignCodes(selectedType, currentDesign.finishing);
                  }
                }}
                className={`w-full px-4 py-3 border ${
                  errors.designNo ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white peer`}
              >
                <option value="">Select Type</option>
                {designTypes.map((val) => (
                  <option key={val.id} value={val.id}>
                    {val.title}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.designType ? "text-red-500" : "text-gray-600"
                }`}
              >
                Design Type{" "}
                {errors.designType && <span className="text-red-500">*</span>}
              </label>
            </div>

            <div className="relative">
              <select
                value={currentDesign.finishing}
                onChange={(e) => {
                  const selectedFinish = e.target.value;
                  setCurrentDesign({
                    ...currentDesign,
                    finishing: selectedFinish,
                  });
                  setErrors({ ...errors, finishing: false });

                  // Fetch designs if design type is already selected
                  if (selectedFinish || currentDesign.designType) {
                    fetchDesignCodes(currentDesign.designType, selectedFinish);
                  }
                }}
                className={`w-full px-4 py-3 border ${
                  errors.designNo ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white peer`}
              >
                <option value="">Select Finishing</option>
                {finishings.map((val) => (
                  <option key={val.id} value={val.id}>
                    {val.title}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.finishing ? "text-red-500" : "text-gray-600"
                }`}
              >
                Finishing{" "}
                {errors.finishing && <span className="text-red-500">*</span>}
              </label>
            </div>

            <div className="relative">
              <select
                value={currentDesign.panelSize}
                onChange={(e) => {
                  setCurrentDesign({
                    ...currentDesign,
                    panelSize: e.target.value,
                  });
                  setErrors({ ...errors, panelSize: false });
                }}
                className={`w-full px-4 py-3 border ${
                  errors.panelSize ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white peer`}
              >
                <option value="">Select Size</option>
                {panelSizes.map((val) => (
                  <option key={val.id} value={val.id}>
                    {val.size}
                  </option>
                ))}
              </select>
              <label
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  errors.panelSize ? "text-red-500" : "text-gray-600"
                }`}
              >
                Panel Size{" "}
                {errors.panelSize && <span className="text-red-500">*</span>}
              </label>
            </div>

            <div className="relative">
              <select
                value={currentDesign.designNo}
                onChange={(e) => {
                  setCurrentDesign({
                    ...currentDesign,
                    designNo: e.target.value,
                  });
                  setErrors({ ...errors, designNo: false });
                }}
                className={`w-full px-4 py-3 border ${
                  errors.designNo ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white peer`}
              >
                <option value="">Select Design</option>
                {designCodes.map((val) => (
                  <option key={val.id} value={val.design_code}>
                    {val.design_code}
                  </option>
                ))}
              </select>
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

        {/* 3. Saved Designs Display Section (Tabular View) */}
        {/* Saved Designs Display Section (Dynamic View) */}
{savedDesigns.map((design) => (
  <div key={design.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
    {/* Header */}
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-blue-50 rounded">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800">
          Design Details - SL - 0{design.id}
        </h2>
      </div>
      <button className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors flex items-center gap-1">
        <span className="text-sm">✎</span> Edit
      </button>
    </div>

    <div className="space-y-2">
      {/* Row 1: Basic Information */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-gray-50 rounded p-1.5">
          <div className="text-xs text-gray-500 mb-0.5">Design Type</div>
          <div className="text-sm font-semibold text-gray-800">
             {getDesignTypeTitle(design.designType)}
          </div>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <div className="text-xs text-gray-500 mb-0.5">Finishing</div>
          <div className="text-sm font-semibold text-gray-800">
            {getFinishingTitle(design.finishing)}
          </div>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <div className="text-xs text-gray-500 mb-0.5">Panel Size</div>
          <div className="text-sm font-semibold text-gray-800">
            {getPanelSize(design.panelSize)}
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
            {design.designNo || "N/A"}
          </div>
        </div>
      </div>

      {/* Row 2: A Section */}
      <div className="bg-gradient-to-r from-blue-50 to-transparent rounded p-2">
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-gray-700 min-w-[70px]">
            A Section:
          </div>
          <div className="flex gap-3 flex-wrap">
            {aSectionSizes.map((size) => (
              <div key={size.id} className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm">
                <span className="text-xs text-gray-500">{size.size}</span>
                <span className="text-sm font-bold text-gray-800">
                  {design.aSection[size.id as number] || "0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Frame */}
      <div className="bg-gradient-to-r from-green-50 to-transparent rounded p-2">
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-gray-700 min-w-[70px]">
            Frame:
          </div>
          <div className="flex gap-3 flex-wrap">
            {frameSizes.map((size) => (
              <div key={size.id} className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm">
                <span className="text-xs text-gray-500">{size.size}</span>
                <span className="text-sm font-bold text-gray-800">
                  {design.frame[size.id as number] || "0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
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

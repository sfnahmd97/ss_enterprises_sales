import { useEffect, useState } from "react";
import { User, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Select from "react-select";
import api from "../../lib/axios";
import type {
  DoorPartSize,
  Finishing,
  OrderForm,
  Customer,
  DesignType,
} from "../../interfaces/common";

export default function OrderForm() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    if (!currentDesign.size) newErrors.size = true;
    if (!currentDesign.nos) newErrors.nos = true;

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      toast.error(
        "Please fill in all required fields: Design Type, Design Number, Finishing, Size, and Nos"
      );
      return;
    }

    // Clear errors and save design
    setErrors({});
    setSavedDesigns([
      ...savedDesigns,
      { ...currentDesign, id: savedDesigns.length + 1 },
    ]);

    // Reset current design
    setCurrentDesign({
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
                  customers.find((opt) => opt.name === formData.customerName) ||
                  null
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    customerName: selectedOption ? selectedOption.name : "",
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
  <div key={design.id} className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-semibold">
          Design Details - SL - 0{design.id}
        </h2>
      </div>
      <button className="text-sm text-gray-600 flex items-center gap-1 hover:text-gray-800">
        <span className="text-lg">✎</span> Edit
      </button>
    </div>

    <div className="space-y-3 text-sm">
      {/* Row 1: Basic Design Info */}
      <div className="grid grid-cols-4 gap-6">
        <div>
          <span className="text-gray-600">Design Type:</span>
          <span className="ml-2 font-medium">{design.designType || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-600">Panel Size:</span>
          <span className="ml-2 font-medium">{design.panelSize || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-600">Nos:</span>
          <span className="ml-2 font-medium">{design.nos || "0"}</span>
        </div>
        <div>
          <span className="text-gray-600">Finishing:</span>
          <span className="ml-2 font-medium">{design.finishing || "N/A"}</span>
        </div>
      </div>

      {/* Row 2: Design & A Section */}
      <div className="grid grid-cols-1 gap-2">
        <div>
          <span className="text-gray-600">Design No.:</span>
          <span className="ml-2 font-medium">{design.designNo || "N/A"}</span>
        </div>

        {/* A Section Dynamic Values */}
        <div>
          <span className="text-gray-600">A Section:</span>
          <div className="grid gap-3 mt-2"
               style={{
                 gridTemplateColumns: `repeat(${aSectionSizes.length}, minmax(0, 1fr))`
               }}>
            {aSectionSizes.map((size) => (
              
              <div key={size.id} className="flex flex-col items-center text-center">
                <span className="text-gray-600 text-xs">{size.size}</span>
                <span className="font-medium">
                  {design.aSection[size.id as number] || "0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Frame Dynamic Values */}
      <div>
        <span className="text-gray-600">Frame:</span>
        <div className="grid gap-3 mt-2"
             style={{
               gridTemplateColumns: `repeat(${frameSizes.length}, minmax(0, 1fr))`
             }}>
          {frameSizes.map((size) => (
            <div key={size.id} className="flex flex-col items-center text-center">
              <span className="text-gray-600 text-xs">{size.size}</span>
              <span className="font-medium">
                {design.frame[size.id as number] || "0"}
              </span>
            </div>
          ))}
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

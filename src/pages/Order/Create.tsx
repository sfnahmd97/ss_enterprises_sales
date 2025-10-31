import { useState } from "react";
import { User, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    place: "",
    brand: "",
    deliveryDate: "",
  });

//   const [currentDesign, setCurrentDesign] = useState({
//     designType: "",
//     designNo: "",
//     finishing: "",
//     panel: "",
//     size: "",
//     nos: "",
//     aSection: { small: "", big: "", large: "" },
//     frame: { small: "", big: "", large: "" },
//   });


interface OrderForm {
  id?: number;
  designType: string;
  designNo: string;
  finishing: string;
  panel?: string;
  size: string;
  nos: string;
  aSection: {
    small: string;
    big: string;
    large: string;
  };
  frame: {
    small: string;
    big: string;
    large: string;
  };
}

const [currentDesign, setCurrentDesign] = useState<OrderForm>({
  id: 0,
  designType: "",
  designNo: "",
  finishing: "",
  panel: "",
  size: "",
  nos: "",
  aSection: { small: "", big: "", large: "" },
  frame: { small: "", big: "", large: "" },
});

interface Errors {
  designType?: boolean;
  designNo?: boolean;
  finishing?: boolean;
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
      
      toast.error("Please fill in all required fields: Design Type, Design Number, Finishing, Size, and Nos");
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
      designType: "",
      designNo: "",
      finishing: "",
      panel: "",
      size: "",
      nos: "",
      aSection: { small: "", big: "", large: "" },
      frame: { small: "", big: "", large: "" },
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { formData, savedDesigns });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
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
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder="Enter the name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer placeholder-transparent"
              />
              <label
                htmlFor="customerName"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
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
                type="text"
                id="deliveryDate"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                placeholder="Enter the Date"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer placeholder-transparent"
              />
              <label
                htmlFor="deliveryDate"
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
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
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <select
                value={currentDesign.designType}
                onChange={(e) => {
                  setCurrentDesign({
                    ...currentDesign,
                    designType: e.target.value,
                  });
                  setErrors({ ...errors, designType: false });
                }}
                className={`w-full px-4 py-3 border ${
                  errors.designType ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white peer`}
              >
                <option value="">Select Type</option>
                <option value="XYZ">XYZ</option>
                <option value="ABC">ABC</option>
                <option value="DEF">DEF</option>
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
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white`}
              >
                <option value="">Select Type</option>
                <option value="DW-001">DW-001</option>
                <option value="DW-002">DW-002</option>
                <option value="DW-003">DW-003</option>
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

            <div className="relative">
              <select
                value={currentDesign.finishing}
                onChange={(e) => {
                  setCurrentDesign({
                    ...currentDesign,
                    finishing: e.target.value,
                  });
                  setErrors({ ...errors, finishing: false });
                }}
                className={`w-full px-4 py-3 border ${
                  errors.finishing ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white`}
              >
                <option value="">Select Finishing</option>
                <option value="Glossy">Glossy</option>
                <option value="Matte">Matte</option>
                <option value="Satin">Satin</option>
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
          </div>

          {/* Panel with Size and Nos */}
          <div className="mb-6">
            <div className="relative rounded-md p-4">
              <div className="flex items-center gap-4">
                {/* PANEL LABEL */}
                <label
                  className="w-20 text-sm text-gray-600">
                  Panel :{" "}
                </label>

                {/* SIZE + NOS IN A ROW */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.size}
                      onChange={(e) => {
                        setCurrentDesign({
                          ...currentDesign,
                          size: e.target.value,
                        });
                        setErrors({ ...errors, size: false });
                      }}
                      placeholder="0"
                      className={`w-full px-3 py-2 border ${
                        errors.size ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <label
                      className={`absolute left-3 -top-2.5 bg-white px-1 text-xs ${
                        errors.size ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      Size{" "}
                      {errors.size && <span className="text-red-500">*</span>}
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.nos}
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
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.aSection.small}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          aSection: {
                            ...currentDesign.aSection,
                            small: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Small
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.aSection.big}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          aSection: {
                            ...currentDesign.aSection,
                            big: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Big
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.aSection.large}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          aSection: {
                            ...currentDesign.aSection,
                            large: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Large
                    </label>
                  </div>
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
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.frame.small}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          frame: {
                            ...currentDesign.frame,
                            small: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Small
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.frame.big}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          frame: {
                            ...currentDesign.frame,
                            big: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Big
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={currentDesign.frame.large}
                      onChange={(e) =>
                        setCurrentDesign({
                          ...currentDesign,
                          frame: {
                            ...currentDesign.frame,
                            large: e.target.value,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600">
                      Large
                    </label>
                  </div>
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
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <span className="text-gray-600">Design Type :</span>
                  <span className="ml-2 font-medium">
                    {design.designType || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Panel :</span>
                  <span className="ml-2 font-medium">
                    {design.panel || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Size</span>
                  <span className="ml-2 font-medium">{design.size || "0"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nos</span>
                  <span className="ml-2 font-medium">{design.nos || "0"}</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <span className="text-gray-600">Design No. :</span>
                  <span className="ml-2 font-medium">
                    {design.designNo || "N/A"}
                  </span>
                </div>
                <div></div>
                <div>
                  <span className="text-gray-600">Small</span>
                  <span className="ml-2 font-medium">
                    {design.aSection.small || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Big</span>
                  <span className="ml-2 font-medium">
                    {design.aSection.big || "0"}
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <span className="text-gray-600">Finishing :</span>
                  <span className="ml-2 font-medium">
                    {design.finishing || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">A section :</span>
                  <span className="ml-2 font-medium">
                    {design.aSection.small || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Big</span>
                  <span className="ml-2 font-medium">
                    {design.frame.big || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Large</span>
                  <span className="ml-2 font-medium">
                    {design.aSection.large || "0"}
                  </span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-4 gap-6">
                <div></div>
                <div></div>
                <div>
                  <span className="text-gray-600">Frame :</span>
                  <span className="ml-2 font-medium">
                    {design.frame.small || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Small</span>
                  <span className="ml-2 font-medium">
                    {design.frame.small || "0"}
                  </span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-4 gap-6">
                <div></div>
                <div></div>
                <div>
                  <span className="text-gray-600">Large</span>
                  <span className="ml-2 font-medium">
                    {design.frame.large || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Large</span>
                  <span className="ml-2 font-medium">
                    {design.frame.large || "0"}
                  </span>
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

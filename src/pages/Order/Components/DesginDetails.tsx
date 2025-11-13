import React from "react";
import Select from "react-select";
import { FileText } from "lucide-react";
import type { OrderForm,DesignType, Finishing, DoorPartSize, DesignCode } from "../../../interfaces/common";


interface Errors {
    designType?: boolean;
    designNo?: boolean;
    finishing?: boolean;
    panelSize?: boolean;
    size?: boolean;
    nos?: boolean;
  }

interface Props {
  savedDesigns: OrderForm[];
  designTypes: DesignType[];
  currentDesign: OrderForm;
  setCurrentDesign: React.Dispatch<React.SetStateAction<OrderForm>>;
  fetchDesignCodes: (designTypeID?: string, finishingID?: string) => Promise<void>;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  errors: Errors;
  finishings: Finishing[];
  designCodes: DesignCode[];
  panelSizes: DoorPartSize[];
  aSectionSizes: DoorPartSize[];
  frameSizes: DoorPartSize[];
  handleAddDesign: React.Dispatch<React.SetStateAction<any>>;
}

export default function DesignDetails({
  savedDesigns,
  designTypes,
  currentDesign,
  setCurrentDesign,
  fetchDesignCodes,
  setErrors,
  errors,
  finishings,
  designCodes,
  panelSizes,
  aSectionSizes,
  frameSizes,
  handleAddDesign,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5"/>
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
                  value: String(d.id ?? ""),
                  label: d.design_code,
                }))}
                value={
                  currentDesign.designNo
                    ? {
                        value: currentDesign.designNo,
                        label: designCodes.find(
                            (d) =>
                              String(d.id ?? "") === currentDesign.designNo
                          )?.design_code || "",
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
  );
}

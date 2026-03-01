import React from "react";
import Select from "react-select";
import { FileText } from "lucide-react";
import type {
  OrderForm,
  DoorPartSize,
  SelectOption,
} from "../../../interfaces/common";

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
  designTypes: SelectOption[];
  currentDesign: OrderForm;
  finishings: SelectOption[];
  designCodes: SelectOption[];
  panelSizes: SelectOption[];
  aSectionSizes: DoorPartSize[];
  frameSizes: DoorPartSize[];
  errors: Errors;
  setCurrentDesign: React.Dispatch<React.SetStateAction<OrderForm>>;
  fetchDesignCodes: (designTypeID?: string, finishingID?: string) => Promise<void>;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  handleAddDesign: React.Dispatch<React.SetStateAction<any>>;
}

/** Reusable quantity input with visible + / - buttons, steps by 5 */
function QuantityInput({
  value,
  onChange,
  error,
  label,
  name,
}: {
  value: number | "";
  onChange: (val: number | "") => void;
  error?: boolean;
  label: string;
  name?: string;
}) {
  const current = value === "" ? 0 : Number(value);
  const increment = () => onChange(current + 5);
  const decrement = () => onChange(Math.max(0, current - 5));

  return (
    <div className="relative mt-3">
      {/* floating label */}
      <label
        className={`absolute left-3 -top-2.5 bg-white px-1 text-xs z-10 ${
          error ? "text-red-500" : "text-gray-600"
        }`}
      >
        {label} {error && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-center border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
      >
        {/* − button */}
        <button
          type="button"
          onClick={decrement}
          className="flex items-center justify-center w-9 h-[42px] text-xl font-bold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-500 active:bg-red-100 transition-colors select-none shrink-0 border-r border-gray-300 rounded-l-md"
        >
          −
        </button>

        {/* number input — native spinners hidden */}
        <input
          type="number"
          name={name}
          min={0}
          value={value}
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
            if (e.key === "ArrowUp") { e.preventDefault(); increment(); }
            if (e.key === "ArrowDown") { e.preventDefault(); decrement(); }
          }}
          onPaste={(e) => {
            if (/[^0-9]/.test(e.clipboardData.getData("text"))) e.preventDefault();
          }}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
          placeholder="0"
          className="w-full text-center py-2 text-sm focus:outline-none bg-white
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none"
        />

        {/* + button */}
        <button
          type="button"
          onClick={increment}
          className="flex items-center justify-center w-9 h-[42px] text-xl font-bold text-gray-600 bg-gray-100 hover:bg-green-50 hover:text-green-600 active:bg-green-100 transition-colors select-none shrink-0 border-l border-gray-300 rounded-r-md"
        >
          +
        </button>
      </div>
    </div>
  );
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
  const findOptionByValue = (options: SelectOption[], value: string | number | undefined) =>
    options.find((opt) => String(opt.value) === String(value)) ?? null;

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "46px",
      height: "46px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "0 0.5rem" }),
    indicatorsContainer: (base: any) => ({ ...base, height: "46px" }),
    menu: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-semibold">
          Design Details - SL - 0{savedDesigns.length + 1}
        </h2>
      </div>

      {/* Design Type, Finishing, Panel Size, Design No */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* DESIGN TYPE */}
        <div className="relative">
          <Select
            options={designTypes}
            value={findOptionByValue(designTypes, currentDesign.designType)}
            onChange={(option) => {
              const newValue = option ? Number(option.value) : ("" as any);
              setCurrentDesign({ ...currentDesign, designType: newValue });
              setErrors({ ...errors, designType: false });
              fetchDesignCodes(String(newValue || ""), String(currentDesign.finishing || ""));
            }}
            placeholder="Select Type"
            isClearable
            className="w-full"
            styles={selectStyles}
          />
          <label
            className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
              errors.designType ? "text-red-500" : "text-gray-600"
            }`}
          >
            Design Type {errors.designType && <span className="text-red-500">*</span>}
          </label>
        </div>

        {/* FINISHING */}
        <div className="relative">
          <Select
            options={finishings}
            value={findOptionByValue(finishings, currentDesign.finishing)}
            onChange={(option) => {
              const newValue = option ? Number(option.value) : ("" as any);
              setCurrentDesign({ ...currentDesign, finishing: newValue });
              setErrors({ ...errors, finishing: false });
              fetchDesignCodes(String(currentDesign.designType || ""), String(newValue || ""));
            }}
            placeholder="Select Finishing"
            isClearable
            className="w-full"
            styles={selectStyles}
          />
          <label
            className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
              errors.finishing ? "text-red-500" : "text-gray-600"
            }`}
          >
            Finishing {errors.finishing && <span className="text-red-500">*</span>}
          </label>
        </div>

        {/* PANEL SIZE */}
        <div className="relative">
          <Select
            options={panelSizes}
            value={findOptionByValue(panelSizes, currentDesign.panelSize)}
            onChange={(option) => {
              const newValue = option ? Number(option.value) : ("" as any);
              setCurrentDesign({ ...currentDesign, panelSize: newValue });
              setErrors({ ...errors, panelSize: false });
            }}
            placeholder="Select Panel Size"
            isClearable
            className="w-full"
            styles={selectStyles}
          />
          <label
            className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
              errors.panelSize ? "text-red-500" : "text-gray-600"
            }`}
          >
            Panel Size {errors.panelSize && <span className="text-red-500">*</span>}
          </label>
        </div>

        {/* DESIGN NO */}
        <div className="relative">
          <Select
            options={designCodes}
            value={findOptionByValue(designCodes, currentDesign.designNo)}
            onChange={(option) => {
              const newValue = option ? Number(option.value) : ("" as any);
              setCurrentDesign({ ...currentDesign, designNo: newValue });
              setErrors({ ...errors, designNo: false });
            }}
            placeholder="Select Design"
            isClearable
            className="w-full"
            styles={selectStyles}
          />
          <label
            className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
              errors.designNo ? "text-red-500" : "text-gray-600"
            }`}
          >
            Design No. {errors.designNo && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>

      {/* Panel / Nos */}
      <div className="mb-6">
        <div className="relative p-4">
          <div className="flex items-center gap-4">
            <label className="w-28 text-sm text-gray-600">Panel :</label>
            <div className="grid grid-cols-2 gap-4 w-full">
              <QuantityInput
                label="Nos"
                name="nos"
                value={(currentDesign.nos ?? "") as number | ""}
                error={errors.nos}
                onChange={(val) => {
                  setCurrentDesign({ ...currentDesign, nos: val as any });
                  setErrors({ ...errors, nos: false });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* A Section */}
      <div className="mb-6">
        <div className="relative p-4">
          <div className="flex items-center gap-4">
            <label className="w-28 text-sm text-gray-600">A section :</label>
            <div
              className="grid gap-4 w-full"
              style={{
                gridTemplateColumns: `repeat(${aSectionSizes.length}, minmax(0, 1fr))`,
              }}
            >
              {aSectionSizes.map((val) => {
                const id = Number(val.id);
                return (
                  <QuantityInput
                    key={id}
                    label={val.size}
                    name={`a_section${id}`}
                    value={
                      (currentDesign.aSection && currentDesign.aSection[id] !== undefined
                        ? currentDesign.aSection[id]
                        : "") as number | ""
                    }
                    onChange={(newVal) =>
                      setCurrentDesign((prev) => ({
                        ...prev,
                        aSection: {
                          ...(prev.aSection || {}),
                          [id]: newVal as any,
                        },
                      }))
                    }
                  />
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
            <label className="w-28 text-sm text-gray-600">Frame :</label>
            <div
              className="grid gap-4 w-full"
              style={{
                gridTemplateColumns: `repeat(${frameSizes.length}, minmax(0, 1fr))`,
              }}
            >
              {frameSizes.map((val) => {
                const id = Number(val.id);
                return (
                  <QuantityInput
                    key={id}
                    label={val.size}
                    name={`frame${id}`}
                    value={
                      (currentDesign.frame && currentDesign.frame[id] !== undefined
                        ? currentDesign.frame[id]
                        : "") as number | ""
                    }
                    onChange={(newVal) =>
                      setCurrentDesign((prev) => ({
                        ...prev,
                        frame: {
                          ...(prev.frame || {}),
                          [id]: newVal as any,
                        },
                      }))
                    }
                  />
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
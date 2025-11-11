import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import type { SelectOption } from "../../../interfaces/common";


interface Props {
  customers: SelectOption[];
  formData: any;
  customerErrors: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function CustomerDetails({ customers, formData, setFormData,customerErrors }: Props) {
  console.log(customerErrors)
  return (
    <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <Select
                options={customers}
                value={
                  customers.find(
                    (opt) => opt.label === formData.customerName
                  ) || null
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
                className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  customerErrors.customerName ? "text-red-500" : "text-gray-600"
                }`}
              >
                Customer Name{" "}
                {customerErrors.customerName && <span className="text-red-500">*</span>}
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
                className="absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600  text-gray-600"
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

            <div className="relative w-full">
  <DatePicker
    selected={formData.deliveryDate ? new Date(formData.deliveryDate) : null}
    onChange={(date) =>
      setFormData({
        ...formData,
        deliveryDate: date ? date.toISOString().split("T")[0] : "",
      })
    }
    dateFormat="dd/MM/yyyy"
    placeholderText="Select Delivery Date"
    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
    calendarClassName="rounded-lg shadow-lg border border-gray-200"
    popperPlacement="bottom-start"
    showPopperArrow={false}
    wrapperClassName="w-full"
  />

  <label className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
                  customerErrors.deliveryDate ? "text-red-500" : "text-gray-600"
                }`}>
    Delivery Date{" "}
                {customerErrors.deliveryDate && <span className="text-red-500">*</span>}
  </label>
</div>

          </div>
  );
}

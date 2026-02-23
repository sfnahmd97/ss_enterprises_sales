import { useState } from "react";
import { FileText } from "lucide-react";
import type {
  OrderForm,
  DoorPartSize,
  SelectOption
} from "../../../interfaces/common";
import DesignDetails from "./DesginDetails";
import api from "../../../lib/axios";

interface Props {
  design: OrderForm;

  // Preview helpers
  getDesignTypeTitle: (id: string | number) => string;
  getFinishingTitle: (id: string | number) => string;
  getDesignCodeTitle: (id: string | number) => string;
  getPanelSize: (id: string | number) => string;

  aSectionSizes: DoorPartSize[];
  frameSizes: DoorPartSize[];

  // NEW EDIT MODE PROPS
  designTypes: SelectOption[];
  finishings: SelectOption[];
  panelSizes: SelectOption[];
  designCodes: SelectOption[];
  fetchDesignCodes: (id1?: string, id2?: string) => Promise<void>;

  updateDesign: (id: number, updatedData: OrderForm) => void;
  removeDesign: (id: number) => void;
  
}


export default function DesignPreviewCard(props: Props) {
  const {
    design,
    getDesignTypeTitle,
    getFinishingTitle,
    getPanelSize,
    aSectionSizes,
    frameSizes,
    designTypes,
    finishings,
    panelSizes,
    designCodes,
    updateDesign,
    removeDesign,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<OrderForm>(design);
  const [errors, setErrors] = useState<any>({});

    const [localDesignCodes, setLocalDesignCodes] = useState<SelectOption[]>(designCodes);

  const fetchLocalDesignCodes = async (id1?: string, id2?: string) => {
    try {
      const res = await api.get(`sales/get-designs/${id1 || ""}/${id2 || ""}`);
      const data = (res.data as { data: any[] }).data;
      setLocalDesignCodes(data.map((d: any) => ({ value: d.id, label: d.design_code })));
    } catch {
      setLocalDesignCodes([]);
    }
  };

  const getLocalDesignCodeTitle = (id: string | number) =>
    localDesignCodes.find((dc) => dc.value === Number(id))?.label || "N/A";

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <DesignDetails
        savedDesigns={[]} // unused here
        designTypes={designTypes}
        currentDesign={editData}
        setCurrentDesign={setEditData}
        fetchDesignCodes={fetchLocalDesignCodes}
        setErrors={setErrors}
        errors={errors}
        finishings={finishings}
        designCodes={localDesignCodes}
        panelSizes={panelSizes}
        aSectionSizes={aSectionSizes}
        frameSizes={frameSizes}
        handleAddDesign={() => {
          updateDesign(design.id, editData);
          setIsEditing(false);
        }}
      />
    );
  }

  // --- PREVIEW MODE ---
  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <div className="flex items-center justify-between mb-3 border-b pb-2">
  <div className="flex items-center gap-2">
    <FileText className="w-4 h-4 text-blue-600" />
    <h2 className="font-semibold text-gray-700">
      Design Details - SL - 0{design.id}
    </h2>
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={() => {
        setEditData(design);
        setIsEditing(true);
      }}
      className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
    >
      ✎ Edit
    </button>

    <button
      onClick={() => removeDesign(design.id)}
      className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100"
    >
      🗑 Remove
    </button>
  </div>
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
              {getLocalDesignCodeTitle(design.designNo) || "N/A"}
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
                <div
                  key={size.id}
                  className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm"
                >
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
                <div
                  key={size.id}
                  className="flex flex-col items-center bg-white rounded p-1.5 min-w-[50px] shadow-sm"
                >
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
  );
}

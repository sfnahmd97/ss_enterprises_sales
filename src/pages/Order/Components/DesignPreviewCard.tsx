import { FileText } from "lucide-react";
import type { OrderForm, DoorPartSize } from "../../../interfaces/common";

interface Props {
  design: OrderForm;
  getDesignTypeTitle: (id: string | number) => string;
  getFinishingTitle: (id: string | number) => string;
  getDesignCodeTitle: (id: string | number) => string;
  getPanelSize: (id: string | number) => string;
  aSectionSizes: DoorPartSize[];
  frameSizes: DoorPartSize[];
}

export default function DesignPreviewCard({
  design,
  getDesignTypeTitle,
  getFinishingTitle,
  getDesignCodeTitle,
  getPanelSize,
  aSectionSizes,
  frameSizes,
}: Props) {
  return (
    <div
      key={design.id}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
    >
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
              {getDesignCodeTitle(design.designNo) || "N/A"}
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

// src/pages/Orders/OrderFormMaster.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/axios";
import PageLoader from "../../components/common/pageLoader";

import type {
  DoorPartSize,
  SelectOption,
} from "../../interfaces/common";
import OrderFormEdit from "./OrderFormEdit";
import OrderFormAdd from "./OrderFormAdd";

interface Props {
  mode: "create" | "edit";
}


export default function OrderFormMaster({ mode }: Props) {
  const { id } = useParams<{ id?: string }>();

  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [designTypes, setDesignTypes] = useState<SelectOption[]>([]);
  const [finishings, setFinishing] = useState<SelectOption[]>([]);
  const [panelSizes, setPanelSizes] = useState<SelectOption[]>([]);
  const [aSectionSizes, setASectionSizes] = useState<DoorPartSize[]>([]);
  const [frameSizes, setFrameSizes] = useState<DoorPartSize[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const res = await api.get("sales/get-customers");
    const data = (res.data as { data: any[] }).data;

    const formattedCustomers = data.map((customer: any) => ({
      value: customer.id,
      label: customer.name,
    }));

    setCustomers(formattedCustomers);
  };

  const fetchDesignTypes = async () => {
    const res = await api.get("sales/get-design-types");
    const data = (res.data as { data: any[] }).data;

    const formattedData = data.map((designType: any) => ({
      value: designType.id,
      label: designType.title,
    }));

    setDesignTypes(formattedData);
  };

  const fetchFinishing = async () => {
    const res = await api.get("sales/get-finishing");
    const data = (res.data as { data: any[] }).data;

    const formattedData = data.map((finishing: any) => ({
      value: finishing.id,
      label: finishing.title,
    }));

    setFinishing(formattedData);
  };

  const fetchPanelSizes = async () => {
    const res = await api.get("sales/get-door-part-sizes/panel");
    const data = (res.data as { data: any[] }).data;

    const formattedData = data.map((panelSize: any) => ({
      value: panelSize.id,
      label: panelSize.size,
    }));

    setPanelSizes(formattedData);
  };

  const fetchASectionSizes = async () => {
    const res = await api.get("sales/get-door-part-sizes/a_section");
    const data = (res.data as { data: any[] }).data;
    setASectionSizes(data);
  };

  const fetchFrameSizes = async () => {
    const res = await api.get("sales/get-door-part-sizes/frame");
    const data = (res.data as { data: any[] }).data;
    setFrameSizes(data);
  };

  useEffect(() => {
    const loadAllMasters = async () => {
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
        console.error("Error loading masters", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllMasters();
  }, []);

  if (loading) return <PageLoader />;

  // 🔁 Shared helpers for preview
  const getDesignTypeTitle = (id: string | number) =>
    designTypes.find((dt) => dt.value === Number(id))?.label || "N/A";

  const getFinishingTitle = (id: string | number) =>
    finishings.find((f) => f.value === Number(id))?.label || "N/A";

  const getPanelSize = (id: string | number) =>
    panelSizes.find((p) => p.value === Number(id))?.label || "N/A";

  return mode === "edit" ? (
    <OrderFormEdit
      orderId={Number(id)}
      customers={customers}
      designTypes={designTypes}
      finishings={finishings}
      panelSizes={panelSizes}
      aSectionSizes={aSectionSizes}
      frameSizes={frameSizes}
      getDesignTypeTitle={getDesignTypeTitle}
      getFinishingTitle={getFinishingTitle}
      getPanelSize={getPanelSize}
    />
  ) : (
    <OrderFormAdd
      customers={customers}
      designTypes={designTypes}
      finishings={finishings}
      panelSizes={panelSizes}
      aSectionSizes={aSectionSizes}
      frameSizes={frameSizes}
      getDesignTypeTitle={getDesignTypeTitle}
      getFinishingTitle={getFinishingTitle}
      getPanelSize={getPanelSize}
    />
  );
}

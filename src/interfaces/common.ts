interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ListApiResponse<T> {
  success: boolean;
  data: T;
  meta: PaginationMeta;
}

export interface Customer {
  id?: number;
  name: string;
}

 export interface DesignType {
  id?: number;
  title: string;
  short: string;
  status?: boolean;
}


export interface Finishing {
  id?: number;
  title: string;
  short: string;
  status?: boolean;
}

export interface UserData {
  name: string;
  email: string;
  designation_label?: string;
  status?: boolean;
}

 export interface Location {
  id?: number;
  location_name: string;
  location_key?: string;
  state_id: string;
  district_id: string;
  state?: string;
  district?: string;
  status?: boolean;
}
 export interface States {
  id?: number;
  key: string;
  name: string;
}
 export interface Districts {
  id?: number;
  key: string;
  name: string;
  state?: string;
}

interface SectionValues {
  [key: string]: string; // or Record<string, string>
}
export interface OrderForm {
    id?: number;
    designType: string;
    panelSize: string;
    designNo: string;
    finishing: string;
    panel?: string;
    size: string;
    nos: string;
    aSection: SectionValues;
    frame: SectionValues;
  }
 export interface DoorPartSize {
  id?: number;
  size: string;
}
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface DesignCode {
  id?: number;
  design_code: string;
}

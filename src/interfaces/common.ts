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


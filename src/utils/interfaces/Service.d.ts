export interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceListResponse {
  data: ServiceItem[];
  pagination?: {
    current: number;
    total: number;
    totalPages: number;
  };
}

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
  notes?: string;
}

export interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceListResponse {
  data: ServiceItem[];
  pagination?: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    limit: number;
  };
}

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
  duration: number;
  notes?: string;
}

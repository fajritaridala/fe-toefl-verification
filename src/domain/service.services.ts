import endpoints from '@/constants/endpoints';
import instance from '@/lib/axios/instance';
import buildQueryString from '@/utils/helpers/queryString';

type GetServicesQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

type GetServicesParams = string | GetServicesQuery;

type CreateServicePayload = {
  name: string;
  description: string;
  price: number;
  notes?: string;
};

type UpdateServicePayload = {
  name?: string;
  description?: string;
  price?: number;
  notes?: string;
};

export const servicesService = {
  // Public
  getServices: (query?: GetServicesParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoints.SERVICES}?${queryString}`
      : endpoints.SERVICES;
    return instance.get(url);
  },
  // Admin
  createService: (payload: CreateServicePayload) => {
    return instance.post(`${endpoints.SERVICES}`, payload);
  },
  // Admin
  updateService: (id: string, payload: UpdateServicePayload) => {
    return instance.patch(`${endpoints.SERVICES}/${id}`, payload);
  },
  // Admin
  removeService: (id: string) => {
    return instance.delete(`${endpoints.SERVICES}/${id}`);
  },
};

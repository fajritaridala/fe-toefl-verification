import buildQueryString from '@/utils/helpers/queryString';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

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
  duration: number;
  notes?: string;
};

type UpdateServicePayload = {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  notes?: string;
};

const servicesService = {
  getServices: (query?: GetServicesParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.SERVICES}?${queryString}`
      : endpoint.SERVICES;
    return instance.get(url);
  },
  getService: (id: string) => {
    return instance.get(`${endpoint.SERVICES}/${id}`);
  },
  createService: (payload: CreateServicePayload) => {
    return instance.post(`${endpoint.SERVICES}`, payload);
  },
  updateService: (id: string, payload: UpdateServicePayload) => {
    return instance.patch(`${endpoint.SERVICES}/${id}`, payload);
  },
  removeService: (id: string) => {
    return instance.delete(`${endpoint.SERVICES}/${id}`);
  },
};

export default servicesService;
